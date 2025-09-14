var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { expect } from 'chai';
import { Property, GetProperties, GetPropertyScope } from './property';
// Define test classes outside of test functions for proper decorator support
class TestElement {
    constructor() {
        this.testProp = '';
        this.numProp = 0;
        this.boolProp = false;
    }
}
__decorate([
    Property({ type: 'string' })
], TestElement.prototype, "testProp", void 0);
__decorate([
    Property({ type: 'number', initial: 42 })
], TestElement.prototype, "numProp", void 0);
__decorate([
    Property({ type: 'boolean', name: 'custom-name' })
], TestElement.prototype, "boolProp", void 0);
describe('Property Decorator', () => {
    describe('Basic Property Declaration', () => {
        it('should register properties with correct metadata', () => {
            const properties = GetProperties();
            const scope = GetPropertyScope(TestElement.prototype);
            const scopedProperties = properties[scope];
            expect(scopedProperties).to.be.an('array');
            expect(scopedProperties.length).to.be.greaterThan(0);
        });
        it('should handle string type properties', () => {
            const properties = GetProperties();
            const scope = GetPropertyScope(TestElement.prototype);
            const stringProp = properties[scope].find(p => p.name === 'test-prop');
            expect(stringProp).to.exist;
            expect(stringProp === null || stringProp === void 0 ? void 0 : stringProp.type).to.equal('string');
        });
        it('should handle number type properties with initial values', () => {
            const properties = GetProperties();
            const scope = GetPropertyScope(TestElement.prototype);
            const numProp = properties[scope].find(p => p.name === 'num-prop');
            expect(numProp).to.exist;
            expect(numProp === null || numProp === void 0 ? void 0 : numProp.type).to.equal('number');
            expect(numProp === null || numProp === void 0 ? void 0 : numProp.initial).to.equal(42);
        });
        it('should handle custom property names', () => {
            const properties = GetProperties();
            const scope = GetPropertyScope(TestElement.prototype);
            const customNameProp = properties[scope].find(p => p.name === 'custom-name');
            expect(customNameProp).to.exist;
            expect(customNameProp === null || customNameProp === void 0 ? void 0 : customNameProp.type).to.equal('boolean');
        });
    });
    describe('Property Options', () => {
        it('should handle all property options correctly', () => {
            class AdvancedTestClass {
                constructor() {
                    this.advancedProp = '';
                }
            }
            __decorate([
                Property({
                    type: 'string',
                    name: 'advanced-prop',
                    spread: 'spread-attr',
                    update: false,
                    initial: 'default-value',
                    checkStoredObject: true,
                    delimiter: ';'
                })
            ], AdvancedTestClass.prototype, "advancedProp", void 0);
            const properties = GetProperties();
            const scope = GetPropertyScope(AdvancedTestClass.prototype);
            const advancedProp = properties[scope].find(p => p.name === 'advanced-prop');
            expect(advancedProp).to.exist;
            expect(advancedProp === null || advancedProp === void 0 ? void 0 : advancedProp.spread).to.equal('spread-attr');
            expect(advancedProp === null || advancedProp === void 0 ? void 0 : advancedProp.update).to.equal(false);
            expect(advancedProp === null || advancedProp === void 0 ? void 0 : advancedProp.initial).to.equal('default-value');
            expect(advancedProp === null || advancedProp === void 0 ? void 0 : advancedProp.checkStoredObject).to.equal(true);
            expect(advancedProp === null || advancedProp === void 0 ? void 0 : advancedProp.delimiter).to.equal(';');
        });
        it('should use default values when options not specified', () => {
            class DefaultTestClass {
            }
            __decorate([
                Property()
            ], DefaultTestClass.prototype, "defaultProp", void 0);
            const properties = GetProperties();
            const scope = GetPropertyScope(DefaultTestClass.prototype);
            const defaultProp = properties[scope].find(p => p.name === 'default-prop');
            expect(defaultProp).to.exist;
            expect(defaultProp === null || defaultProp === void 0 ? void 0 : defaultProp.type).to.equal('string');
            expect(defaultProp === null || defaultProp === void 0 ? void 0 : defaultProp.spread).to.equal('');
            expect(defaultProp === null || defaultProp === void 0 ? void 0 : defaultProp.update).to.equal(false);
            expect(defaultProp === null || defaultProp === void 0 ? void 0 : defaultProp.checkStoredObject).to.equal(false);
            expect(defaultProp === null || defaultProp === void 0 ? void 0 : defaultProp.delimiter).to.equal(',');
        });
    });
    describe('Property Scope Management', () => {
        it('should generate unique scopes for different classes', () => {
            class ClassA {
                constructor() {
                    this.propA = '';
                }
            }
            __decorate([
                Property({ type: 'string' })
            ], ClassA.prototype, "propA", void 0);
            class ClassB {
                constructor() {
                    this.propB = '';
                }
            }
            __decorate([
                Property({ type: 'string' })
            ], ClassB.prototype, "propB", void 0);
            const scopeA = GetPropertyScope(ClassA.prototype);
            const scopeB = GetPropertyScope(ClassB.prototype);
            expect(scopeA).to.not.equal(scopeB);
        });
        it('should return same scope for same class', () => {
            const scope1 = GetPropertyScope(TestElement.prototype);
            const scope2 = GetPropertyScope(TestElement.prototype);
            expect(scope1).to.equal(scope2);
        });
    });
});
