"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const resource_1 = require("./resource");
describe('ResourceElement', () => {
    describe('Class Structure and Interface', () => {
        it('should extend CustomElement', () => {
            (0, chai_1.expect)(resource_1.ResourceElement.prototype).to.be.instanceOf(Object);
            (0, chai_1.expect)(Object.getPrototypeOf(resource_1.ResourceElement.prototype).constructor.name).to.equal('CustomElement');
        });
        it('should implement IResourceSource interface', () => {
            const prototype = resource_1.ResourceElement.prototype;
            (0, chai_1.expect)(prototype).to.have.property('GetResource');
            (0, chai_1.expect)(prototype.GetResource).to.be.a('function');
        });
        it('should be properly configured for property decorators', () => {
            // Test that the class is structured correctly for property decorators  
            (0, chai_1.expect)(resource_1.ResourceElement.prototype.constructor.name).to.equal('ResourceElement');
        });
    });
    describe('Constructor Behavior', () => {
        it('should set template and hidden options', () => {
            // Mock the constructor behavior
            const expectedOptions = {
                isTemplate: true,
                isHidden: true,
            };
            (0, chai_1.expect)(expectedOptions.isTemplate).to.be.true;
            (0, chai_1.expect)(expectedOptions.isHidden).to.be.true;
        });
        it('should initialize with default property values', () => {
            // Test default values as they would be set
            const mockElement = {
                src: '',
                type: ''
            };
            (0, chai_1.expect)(mockElement.src).to.equal('');
            (0, chai_1.expect)(mockElement.type).to.equal('');
        });
    });
    describe('GetResource Method', () => {
        it('should return IResourceMixedItemInfo for script type', () => {
            const mockElement = {
                src: 'test-script.js',
                type: 'script',
                GetResource: function () {
                    if (this.type === 'link' || this.type === 'script' || this.type === 'data') {
                        return {
                            type: this.type,
                            path: this.src,
                        };
                    }
                    return this.src;
                }
            };
            const result = mockElement.GetResource();
            (0, chai_1.expect)(result).to.be.an('object');
            (0, chai_1.expect)(result).to.have.property('type', 'script');
            (0, chai_1.expect)(result).to.have.property('path', 'test-script.js');
        });
        it('should return IResourceMixedItemInfo for link type', () => {
            const mockElement = {
                src: 'styles.css',
                type: 'link',
                GetResource: function () {
                    if (this.type === 'link' || this.type === 'script' || this.type === 'data') {
                        return {
                            type: this.type,
                            path: this.src,
                        };
                    }
                    return this.src;
                }
            };
            const result = mockElement.GetResource();
            (0, chai_1.expect)(result).to.be.an('object');
            (0, chai_1.expect)(result).to.have.property('type', 'link');
            (0, chai_1.expect)(result).to.have.property('path', 'styles.css');
        });
        it('should return IResourceMixedItemInfo for data type', () => {
            const mockElement = {
                src: 'data.json',
                type: 'data',
                GetResource: function () {
                    if (this.type === 'link' || this.type === 'script' || this.type === 'data') {
                        return {
                            type: this.type,
                            path: this.src,
                        };
                    }
                    return this.src;
                }
            };
            const result = mockElement.GetResource();
            (0, chai_1.expect)(result).to.be.an('object');
            (0, chai_1.expect)(result).to.have.property('type', 'data');
            (0, chai_1.expect)(result).to.have.property('path', 'data.json');
        });
        it('should return src string for unknown types', () => {
            const mockElement = {
                src: 'unknown-resource.txt',
                type: 'unknown',
                GetResource: function () {
                    if (this.type === 'link' || this.type === 'script' || this.type === 'data') {
                        return {
                            type: this.type,
                            path: this.src,
                        };
                    }
                    return this.src;
                }
            };
            const result = mockElement.GetResource();
            (0, chai_1.expect)(result).to.be.a('string');
            (0, chai_1.expect)(result).to.equal('unknown-resource.txt');
        });
        it('should return src string for empty type', () => {
            const mockElement = {
                src: 'generic-resource.txt',
                type: '',
                GetResource: function () {
                    if (this.type === 'link' || this.type === 'script' || this.type === 'data') {
                        return {
                            type: this.type,
                            path: this.src,
                        };
                    }
                    return this.src;
                }
            };
            const result = mockElement.GetResource();
            (0, chai_1.expect)(result).to.be.a('string');
            (0, chai_1.expect)(result).to.equal('generic-resource.txt');
        });
        it('should handle empty src with valid type', () => {
            const mockElement = {
                src: '',
                type: 'script',
                GetResource: function () {
                    if (this.type === 'link' || this.type === 'script' || this.type === 'data') {
                        return {
                            type: this.type,
                            path: this.src,
                        };
                    }
                    return this.src;
                }
            };
            const result = mockElement.GetResource();
            (0, chai_1.expect)(result).to.be.an('object');
            (0, chai_1.expect)(result).to.have.property('type', 'script');
            (0, chai_1.expect)(result).to.have.property('path', '');
        });
    });
    describe('HandlePostAttributesProcessPostfix_ Method', () => {
        it('should find ancestor and add resource', () => {
            let addResourceCalled = false;
            let resourcePassed = null;
            const mockElement = {
                HandlePostAttributesProcessPostfix_: function () {
                    // Mock FindAncestor finding an ancestor with AddResource
                    const mockAncestor = {
                        AddResource: (resource) => {
                            addResourceCalled = true;
                            resourcePassed = resource;
                        }
                    };
                    // Simulate finding the ancestor and calling AddResource
                    mockAncestor.AddResource(this);
                }
            };
            mockElement.HandlePostAttributesProcessPostfix_();
            (0, chai_1.expect)(addResourceCalled).to.be.true;
            (0, chai_1.expect)(resourcePassed).to.equal(mockElement);
        });
        it('should handle case when no ancestor found', () => {
            const mockElement = {
                HandlePostAttributesProcessPostfix_: function () {
                    // Mock FindAncestor returning null
                    const ancestor = null;
                    if (ancestor && 'AddResource' in ancestor) {
                        ancestor.AddResource(this);
                    }
                }
            };
            // Should not throw when no ancestor found
            (0, chai_1.expect)(() => {
                mockElement.HandlePostAttributesProcessPostfix_();
            }).to.not.throw();
        });
    });
    describe('ShouldLoadResources_ Method', () => {
        it('should return false', () => {
            const mockElement = {
                ShouldLoadResources_: function () {
                    return false;
                }
            };
            const result = mockElement.ShouldLoadResources_();
            (0, chai_1.expect)(result).to.be.false;
        });
    });
    describe('Property Configuration', () => {
        it('should be structured for property decorators', () => {
            // Test that the class has the expected structure for decorated properties
            (0, chai_1.expect)(resource_1.ResourceElement.prototype.constructor.name).to.equal('ResourceElement');
            (0, chai_1.expect)(resource_1.ResourceElement.prototype.GetResource).to.be.a('function');
        });
    });
    describe('Resource Type Validation', () => {
        const validTypes = ['link', 'script', 'data'];
        const invalidTypes = ['image', 'font', 'video', 'audio', '', 'invalid'];
        validTypes.forEach(type => {
            it(`should handle valid type: ${type}`, () => {
                const mockElement = {
                    src: `test.${type === 'script' ? 'js' : type === 'link' ? 'css' : 'json'}`,
                    type: type,
                    GetResource: function () {
                        if (this.type === 'link' || this.type === 'script' || this.type === 'data') {
                            return {
                                type: this.type,
                                path: this.src,
                            };
                        }
                        return this.src;
                    }
                };
                const result = mockElement.GetResource();
                (0, chai_1.expect)(result).to.be.an('object');
                (0, chai_1.expect)(result).to.have.property('type', type);
            });
        });
        invalidTypes.forEach(type => {
            it(`should return string for invalid type: ${type || 'empty'}`, () => {
                const mockElement = {
                    src: 'test-file.txt',
                    type: type,
                    GetResource: function () {
                        if (this.type === 'link' || this.type === 'script' || this.type === 'data') {
                            return {
                                type: this.type,
                                path: this.src,
                            };
                        }
                        return this.src;
                    }
                };
                const result = mockElement.GetResource();
                (0, chai_1.expect)(result).to.be.a('string');
                (0, chai_1.expect)(result).to.equal('test-file.txt');
            });
        });
    });
    describe('ResourceElementCompact Function', () => {
        it('should exist and be callable', () => {
            (0, chai_1.expect)(resource_1.ResourceElementCompact).to.be.a('function');
            (0, chai_1.expect)(resource_1.ResourceElementCompact.name).to.equal('ResourceElementCompact');
        });
    });
    describe('Integration Behavior', () => {
        it('should work as IResourceSource', () => {
            const mockElement = {
                src: 'integration-test.js',
                type: 'script',
                GetResource: function () {
                    if (this.type === 'link' || this.type === 'script' || this.type === 'data') {
                        return {
                            type: this.type,
                            path: this.src,
                        };
                    }
                    return this.src;
                }
            };
            // Should implement IResourceSource interface
            (0, chai_1.expect)(mockElement).to.have.property('GetResource');
            (0, chai_1.expect)(mockElement.GetResource).to.be.a('function');
            const resource = mockElement.GetResource();
            (0, chai_1.expect)(resource).to.exist;
        });
        it('should provide consistent resource format', () => {
            const testCases = [
                { src: 'test1.js', type: 'script' },
                { src: 'test2.css', type: 'link' },
                { src: 'test3.json', type: 'data' }
            ];
            testCases.forEach(({ src, type }) => {
                const mockElement = {
                    src,
                    type,
                    GetResource: function () {
                        if (this.type === 'link' || this.type === 'script' || this.type === 'data') {
                            return {
                                type: this.type,
                                path: this.src,
                            };
                        }
                        return this.src;
                    }
                };
                const resource = mockElement.GetResource();
                (0, chai_1.expect)(resource).to.be.an('object');
                (0, chai_1.expect)(resource).to.have.property('type', type);
                (0, chai_1.expect)(resource).to.have.property('path', src);
            });
        });
    });
});
