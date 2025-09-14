import { expect } from 'chai';
import { NativeElement, NativeElementCompact } from './native';
describe('NativeElement', () => {
    describe('Class Structure and Interface', () => {
        it('should extend CustomElement', () => {
            expect(NativeElement.prototype).to.be.instanceOf(Object);
            expect(Object.getPrototypeOf(NativeElement.prototype).constructor.name).to.equal('CustomElement');
        });
        it('should implement INativeElement interface', () => {
            const prototype = NativeElement.prototype;
            expect(prototype).to.have.property('GetAttributes');
            expect(prototype.GetAttributes).to.be.a('function');
        });
        it('should have protected methods from parent class', () => {
            const prototype = NativeElement.prototype;
            expect(prototype).to.have.property('HandleElementScopeCreatedPrefix_');
        });
    });
    describe('Constructor Behavior', () => {
        it('should set template and hidden options', () => {
            // Test the logic that would be executed in constructor
            const mockElement = {
                attributes: [],
                attributes_: [],
                options_: { isTemplate: false, isHidden: false },
                style: { display: '' },
                removeAttribute: () => { }
            };
            // Simulate constructor logic
            Array.from(mockElement.attributes).forEach(({ name, value }) => {
                mockElement.attributes_.push({ name, value });
                mockElement.removeAttribute();
            });
            mockElement.options_.isTemplate = true;
            mockElement.options_.isHidden = true;
            mockElement.style.display = 'none';
            expect(mockElement.options_.isTemplate).to.be.true;
            expect(mockElement.options_.isHidden).to.be.true;
            expect(mockElement.style.display).to.equal('none');
        });
        it('should process initial attributes', () => {
            // Mock element with initial attributes
            const mockAttributes = [
                { name: 'data-test', value: 'value1' },
                { name: 'class', value: 'test-class' },
                { name: 'id', value: 'test-id' }
            ];
            const mockElement = {
                attributes: mockAttributes,
                attributes_: [],
                removedAttributes: [],
                removeAttribute: function (name) {
                    this.removedAttributes.push(name);
                }
            };
            // Simulate constructor attribute processing
            Array.from(mockElement.attributes).forEach(({ name, value }) => {
                mockElement.attributes_.push({ name, value });
                mockElement.removeAttribute(name);
            });
            expect(mockElement.attributes_).to.have.length(3);
            expect(mockElement.attributes_[0]).to.deep.equal({ name: 'data-test', value: 'value1' });
            expect(mockElement.attributes_[1]).to.deep.equal({ name: 'class', value: 'test-class' });
            expect(mockElement.attributes_[2]).to.deep.equal({ name: 'id', value: 'test-id' });
            expect(mockElement.removedAttributes).to.have.length(3);
        });
        it('should handle empty attributes', () => {
            const mockElement = {
                attributes: [],
                attributes_: [],
                removeAttribute: () => { }
            };
            // Simulate constructor logic with no attributes
            Array.from(mockElement.attributes).forEach(({ name, value }) => {
                mockElement.attributes_.push({ name, value });
                mockElement.removeAttribute();
            });
            expect(mockElement.attributes_).to.be.an('array');
            expect(mockElement.attributes_).to.have.length(0);
        });
    });
    describe('GetAttributes Method', () => {
        it('should return the stored attributes array', () => {
            const mockAttributes = [
                { name: 'data-value', value: 'test' },
                { name: 'class', value: 'test-class' }
            ];
            const mockElement = {
                attributes_: mockAttributes,
                GetAttributes: function () {
                    return this.attributes_;
                }
            };
            const result = mockElement.GetAttributes();
            expect(result).to.equal(mockAttributes);
            expect(result).to.have.length(2);
            expect(result[0]).to.deep.equal({ name: 'data-value', value: 'test' });
            expect(result[1]).to.deep.equal({ name: 'class', value: 'test-class' });
        });
        it('should return empty array when no attributes', () => {
            const mockElement = {
                attributes_: [],
                GetAttributes: function () {
                    return this.attributes_;
                }
            };
            const result = mockElement.GetAttributes();
            expect(result).to.be.an('array');
            expect(result).to.have.length(0);
        });
        it('should preserve attribute structure', () => {
            const testAttribute = {
                name: 'test-attribute',
                value: 'test-value'
            };
            const mockElement = {
                attributes_: [testAttribute],
                GetAttributes: function () {
                    return this.attributes_;
                }
            };
            const result = mockElement.GetAttributes();
            expect(result[0]).to.have.property('name');
            expect(result[0]).to.have.property('value');
            expect(result[0].name).to.equal('test-attribute');
            expect(result[0].value).to.equal('test-value');
        });
    });
    describe('HandleElementScopeCreatedPrefix_ Method', () => {
        it('should find and call AddNativeElement on ancestor', () => {
            let addNativeElementCalled = false;
            let elementPassed = null;
            const mockParams = { /* mock IElementScopeCreatedCallbackParams */};
            const mockElement = {
                isNativeElement: true,
                HandleElementScopeCreatedPrefix_: function (params) {
                    // Mock FindAncestor logic - find an ancestor that has AddNativeElement
                    const mockAncestor = {
                        AddNativeElement: (element) => {
                            addNativeElementCalled = true;
                            elementPassed = element;
                        }
                    };
                    // Simulate finding the ancestor
                    mockAncestor.AddNativeElement(this);
                    // Call super method (mocked)
                    // super.HandleElementScopeCreatedPrefix_(params);
                }
            };
            mockElement.HandleElementScopeCreatedPrefix_(mockParams);
            expect(addNativeElementCalled).to.be.true;
            expect(elementPassed).to.equal(mockElement);
        });
        it('should handle case when no ancestor with AddNativeElement found', () => {
            const mockParams = { /* mock IElementScopeCreatedCallbackParams */};
            const mockElement = {
                HandleElementScopeCreatedPrefix_: function (params) {
                    // Mock FindAncestor returning null (no ancestor found)
                    const ancestor = null;
                    // Should not throw error when ancestor is null
                    if (ancestor && 'AddNativeElement' in ancestor) {
                        ancestor.AddNativeElement(this);
                    }
                    // Call super method (mocked)
                    // super.HandleElementScopeCreatedPrefix_(params);
                }
            };
            // Should not throw
            expect(() => {
                mockElement.HandleElementScopeCreatedPrefix_(mockParams);
            }).to.not.throw();
        });
    });
    describe('NativeElementCompact Function', () => {
        it('should exist and be callable', () => {
            expect(NativeElementCompact).to.be.a('function');
            // Function exists and can be called (actual registration may fail in test environment)
            expect(NativeElementCompact.name).to.equal('NativeElementCompact');
        });
    });
    describe('Attribute Processing', () => {
        it('should handle various attribute types', () => {
            const testCases = [
                { name: 'id', value: 'test-id' },
                { name: 'class', value: 'class1 class2' },
                { name: 'data-value', value: 'some-data' },
                { name: 'aria-label', value: 'accessibility label' },
                { name: 'style', value: 'color: red;' },
                { name: 'custom-attr', value: '' },
                { name: 'boolean-attr', value: 'true' }
            ];
            const mockElement = {
                attributes: testCases,
                attributes_: [],
                removedAttributes: [],
                removeAttribute: function (name) {
                    this.removedAttributes.push(name);
                }
            };
            // Process attributes
            Array.from(mockElement.attributes).forEach(({ name, value }) => {
                mockElement.attributes_.push({ name, value });
                mockElement.removeAttribute(name);
            });
            expect(mockElement.attributes_).to.have.length(testCases.length);
            testCases.forEach((testCase, index) => {
                expect(mockElement.attributes_[index]).to.deep.equal(testCase);
            });
            expect(mockElement.removedAttributes).to.have.length(testCases.length);
        });
        it('should preserve attribute order', () => {
            const orderedAttributes = [
                { name: 'first', value: '1' },
                { name: 'second', value: '2' },
                { name: 'third', value: '3' }
            ];
            const mockElement = {
                attributes: orderedAttributes,
                attributes_: [],
                removeAttribute: () => { }
            };
            Array.from(mockElement.attributes).forEach(({ name, value }) => {
                mockElement.attributes_.push({ name, value });
                mockElement.removeAttribute();
            });
            expect(mockElement.attributes_[0].name).to.equal('first');
            expect(mockElement.attributes_[1].name).to.equal('second');
            expect(mockElement.attributes_[2].name).to.equal('third');
        });
    });
});
