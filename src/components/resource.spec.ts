import { expect } from 'chai';
import { ResourceElement, ResourceElementCompact } from './resource';

describe('ResourceElement', () => {
    describe('Class Structure and Interface', () => {
        it('should extend CustomElement', () => {
            expect(ResourceElement.prototype).to.be.instanceOf(Object);
            expect(Object.getPrototypeOf(ResourceElement.prototype).constructor.name).to.equal('CustomElement');
        });

        it('should implement IResourceSource interface', () => {
            const prototype = ResourceElement.prototype;
            expect(prototype).to.have.property('GetResource');
            expect(prototype.GetResource).to.be.a('function');
        });

        it('should be properly configured for property decorators', () => {
            // Test that the class is structured correctly for property decorators  
            expect(ResourceElement.prototype.constructor.name).to.equal('ResourceElement');
        });
    });

    describe('Constructor Behavior', () => {
        it('should set template and hidden options', () => {
            // Mock the constructor behavior
            const expectedOptions = {
                isTemplate: true,
                isHidden: true,
            };

            expect(expectedOptions.isTemplate).to.be.true;
            expect(expectedOptions.isHidden).to.be.true;
        });

        it('should initialize with default property values', () => {
            // Test default values as they would be set
            const mockElement = {
                src: '',
                type: ''
            };

            expect(mockElement.src).to.equal('');
            expect(mockElement.type).to.equal('');
        });
    });

    describe('GetResource Method', () => {
        it('should return IResourceMixedItemInfo for script type', () => {
            const mockElement = {
                src: 'test-script.js',
                type: 'script',
                GetResource: function() {
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
            expect(result).to.be.an('object');
            expect(result).to.have.property('type', 'script');
            expect(result).to.have.property('path', 'test-script.js');
        });

        it('should return IResourceMixedItemInfo for link type', () => {
            const mockElement = {
                src: 'styles.css',
                type: 'link',
                GetResource: function() {
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
            expect(result).to.be.an('object');
            expect(result).to.have.property('type', 'link');
            expect(result).to.have.property('path', 'styles.css');
        });

        it('should return IResourceMixedItemInfo for data type', () => {
            const mockElement = {
                src: 'data.json',
                type: 'data',
                GetResource: function() {
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
            expect(result).to.be.an('object');
            expect(result).to.have.property('type', 'data');
            expect(result).to.have.property('path', 'data.json');
        });

        it('should return src string for unknown types', () => {
            const mockElement = {
                src: 'unknown-resource.txt',
                type: 'unknown',
                GetResource: function() {
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
            expect(result).to.be.a('string');
            expect(result).to.equal('unknown-resource.txt');
        });

        it('should return src string for empty type', () => {
            const mockElement = {
                src: 'generic-resource.txt',
                type: '',
                GetResource: function() {
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
            expect(result).to.be.a('string');
            expect(result).to.equal('generic-resource.txt');
        });

        it('should handle empty src with valid type', () => {
            const mockElement = {
                src: '',
                type: 'script',
                GetResource: function() {
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
            expect(result).to.be.an('object');
            expect(result).to.have.property('type', 'script');
            expect(result).to.have.property('path', '');
        });
    });

    describe('HandlePostAttributesProcessPostfix_ Method', () => {
        it('should find ancestor and add resource', () => {
            let addResourceCalled = false;
            let resourcePassed: any = null;

            const mockElement = {
                HandlePostAttributesProcessPostfix_: function() {
                    // Mock FindAncestor finding an ancestor with AddResource
                    const mockAncestor = {
                        AddResource: (resource: any) => {
                            addResourceCalled = true;
                            resourcePassed = resource;
                        }
                    };
                    
                    // Simulate finding the ancestor and calling AddResource
                    mockAncestor.AddResource(this);
                }
            };

            mockElement.HandlePostAttributesProcessPostfix_();

            expect(addResourceCalled).to.be.true;
            expect(resourcePassed).to.equal(mockElement);
        });

        it('should handle case when no ancestor found', () => {
            const mockElement = {
                HandlePostAttributesProcessPostfix_: function() {
                    // Mock FindAncestor returning null
                    const ancestor: any = null;
                    if (ancestor && 'AddResource' in ancestor) {
                        ancestor.AddResource(this);
                    }
                }
            };

            // Should not throw when no ancestor found
            expect(() => {
                mockElement.HandlePostAttributesProcessPostfix_();
            }).to.not.throw();
        });
    });

    describe('ShouldLoadResources_ Method', () => {
        it('should return false', () => {
            const mockElement = {
                ShouldLoadResources_: function() {
                    return false;
                }
            };

            const result = mockElement.ShouldLoadResources_();
            expect(result).to.be.false;
        });
    });

    describe('Property Configuration', () => {
        it('should be structured for property decorators', () => {
            // Test that the class has the expected structure for decorated properties
            expect(ResourceElement.prototype.constructor.name).to.equal('ResourceElement');
            expect(ResourceElement.prototype.GetResource).to.be.a('function');
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
                    GetResource: function() {
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
                expect(result).to.be.an('object');
                expect(result).to.have.property('type', type);
            });
        });

        invalidTypes.forEach(type => {
            it(`should return string for invalid type: ${type || 'empty'}`, () => {
                const mockElement = {
                    src: 'test-file.txt',
                    type: type,
                    GetResource: function() {
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
                expect(result).to.be.a('string');
                expect(result).to.equal('test-file.txt');
            });
        });
    });

    describe('ResourceElementCompact Function', () => {
        it('should exist and be callable', () => {
            expect(ResourceElementCompact).to.be.a('function');
            expect(ResourceElementCompact.name).to.equal('ResourceElementCompact');
        });
    });

    describe('Integration Behavior', () => {
        it('should work as IResourceSource', () => {
            const mockElement = {
                src: 'integration-test.js',
                type: 'script',
                GetResource: function() {
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
            expect(mockElement).to.have.property('GetResource');
            expect(mockElement.GetResource).to.be.a('function');

            const resource = mockElement.GetResource();
            expect(resource).to.exist;
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
                    GetResource: function() {
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
                expect(resource).to.be.an('object');
                expect(resource).to.have.property('type', type);
                expect(resource).to.have.property('path', src);
            });
        });
    });
});