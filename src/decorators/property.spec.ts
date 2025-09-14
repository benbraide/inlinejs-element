import { expect } from 'chai';
import { Property, GetProperties, GetPropertyScope, IProperty } from './property';

// Define test classes outside of test functions for proper decorator support
class TestElement {
    @Property({ type: 'string' })
    public testProp: string = '';

    @Property({ type: 'number', initial: 42 })
    public numProp: number = 0;

    @Property({ type: 'boolean', name: 'custom-name' })
    public boolProp: boolean = false;
}

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
            expect(stringProp?.type).to.equal('string');
        });

        it('should handle number type properties with initial values', () => {
            const properties = GetProperties();
            const scope = GetPropertyScope(TestElement.prototype);
            const numProp = properties[scope].find(p => p.name === 'num-prop');
            
            expect(numProp).to.exist;
            expect(numProp?.type).to.equal('number');
            expect(numProp?.initial).to.equal(42);
        });

        it('should handle custom property names', () => {
            const properties = GetProperties();
            const scope = GetPropertyScope(TestElement.prototype);
            const customNameProp = properties[scope].find(p => p.name === 'custom-name');
            
            expect(customNameProp).to.exist;
            expect(customNameProp?.type).to.equal('boolean');
        });
    });

    describe('Property Options', () => {
        it('should handle all property options correctly', () => {
            class AdvancedTestClass {
                @Property({ 
                    type: 'string',
                    name: 'advanced-prop',
                    spread: 'spread-attr',
                    update: false,
                    initial: 'default-value',
                    checkStoredObject: true,
                    delimiter: ';'
                })
                public advancedProp: string = '';
            }

            const properties = GetProperties();
            const scope = GetPropertyScope(AdvancedTestClass.prototype);
            const advancedProp = properties[scope].find(p => p.name === 'advanced-prop');
            
            expect(advancedProp).to.exist;
            expect(advancedProp?.spread).to.equal('spread-attr');
            expect(advancedProp?.update).to.equal(false);
            expect(advancedProp?.initial).to.equal('default-value');
            expect(advancedProp?.checkStoredObject).to.equal(true);
            expect(advancedProp?.delimiter).to.equal(';');
        });

        it('should use default values when options not specified', () => {
            class DefaultTestClass {
                @Property()
                public defaultProp: any;
            }

            const properties = GetProperties();
            const scope = GetPropertyScope(DefaultTestClass.prototype);
            const defaultProp = properties[scope].find(p => p.name === 'default-prop');
            
            expect(defaultProp).to.exist;
            expect(defaultProp?.type).to.equal('string');
            expect(defaultProp?.spread).to.equal('');
            expect(defaultProp?.update).to.equal(false);
            expect(defaultProp?.checkStoredObject).to.equal(false);
            expect(defaultProp?.delimiter).to.equal(',');
        });
    });

    describe('Property Scope Management', () => {
        it('should generate unique scopes for different classes', () => {
            class ClassA {
                @Property({ type: 'string' })
                public propA: string = '';
            }

            class ClassB {
                @Property({ type: 'string' })
                public propB: string = '';
            }

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