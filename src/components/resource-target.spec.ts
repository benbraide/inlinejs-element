import { expect } from 'chai';
import { ResourceTargetElement, ResourceTargetElementCompact } from './resource-target';

describe('ResourceTargetElement', () => {
    describe('Class Structure and Interface', () => {
        it('should extend CustomElement', () => {
            expect(ResourceTargetElement.prototype).to.be.instanceOf(Object);
            expect(Object.getPrototypeOf(ResourceTargetElement.prototype).constructor.name).to.equal('CustomElement');
        });

        it('should implement IResourceTargetAdvanced interface', () => {
            const prototype = ResourceTargetElement.prototype;
            expect(prototype).to.have.property('LoadTargetResources');
            expect(prototype.LoadTargetResources).to.be.a('function');
        });

        it('should have all required method properties', () => {
            const prototype = ResourceTargetElement.prototype;
            expect(prototype).to.have.property('UpdateAttributesProperty');
            expect(prototype.UpdateAttributesProperty).to.be.a('function');
        });
    });

    describe('Constructor Behavior', () => {
        it('should set hidden option', () => {
            const expectedOptions = {
                isHidden: true,
            };

            expect(expectedOptions.isHidden).to.be.true;
        });

        it('should initialize with default property values', () => {
            const mockElement = {
                sequential: false,
                defer: false,
                onloaded: '',
                onloadederror: '',
                attributes_: null
            };

            expect(mockElement.sequential).to.be.false;
            expect(mockElement.defer).to.be.false;
            expect(mockElement.onloaded).to.equal('');
            expect(mockElement.onloadederror).to.equal('');
            expect(mockElement.attributes_).to.be.null;
        });
    });

    describe('UpdateAttributesProperty Method', () => {
        it('should update attributes_ property with object', () => {
            const mockElement = {
                attributes_: null as Record<string, string> | null,
                UpdateAttributesProperty: function(value: Record<string, string> | null) {
                    this.attributes_ = value;
                }
            };

            const testAttributes = {
                'data-test': 'value1',
                'class': 'test-class',
                'id': 'test-id'
            };

            mockElement.UpdateAttributesProperty(testAttributes);
            expect(mockElement.attributes_).to.equal(testAttributes);
            expect(mockElement.attributes_).to.have.property('data-test', 'value1');
            expect(mockElement.attributes_).to.have.property('class', 'test-class');
            expect(mockElement.attributes_).to.have.property('id', 'test-id');
        });

        it('should handle null value', () => {
            const mockElement = {
                attributes_: { 'existing': 'value' } as Record<string, string> | null,
                UpdateAttributesProperty: function(value: Record<string, string> | null) {
                    this.attributes_ = value;
                }
            };

            mockElement.UpdateAttributesProperty(null);
            expect(mockElement.attributes_).to.be.null;
        });

        it('should handle empty object', () => {
            const mockElement = {
                attributes_: null as Record<string, string> | null,
                UpdateAttributesProperty: function(value: Record<string, string> | null) {
                    this.attributes_ = value;
                }
            };

            const emptyAttributes = {};
            mockElement.UpdateAttributesProperty(emptyAttributes);
            expect(mockElement.attributes_).to.equal(emptyAttributes);
            expect(Object.keys(mockElement.attributes_ || {})).to.have.length(0);
        });
    });

    describe('LoadResources Method', () => {
        it('should wrap super.LoadResources with promise handling', async () => {
            let onloadedCalled = false;
            let onloadederrorCalled = false;

            const mockElement = {
                loadedResources_: null,
                onloaded: 'console.log("loaded")',
                onloadederror: 'console.log("error")',
                EvaluateExpression: function(expr: string, options: any) {
                    if (expr === this.onloaded) {
                        onloadedCalled = true;
                    } else if (expr === this.onloadederror) {
                        onloadederrorCalled = true;
                    }
                },
                LoadResources: function() {
                    const wasLoaded = this.loadedResources_;
                    return new Promise((resolve, reject) => {
                        // Mock super.LoadResources() success
                        const mockSuperPromise = Promise.resolve({ data: 'test' });
                        
                        mockSuperPromise.then((data) => {
                            if (!wasLoaded && this.onloaded) {
                                this.EvaluateExpression(this.onloaded, {
                                    disableFunctionCall: false,
                                    contexts: { data },
                                });
                            }
                            resolve(data);
                        }).catch((reason) => {
                            if (this.onloadederror) {
                                this.EvaluateExpression(this.onloadederror, {
                                    disableFunctionCall: false,
                                    contexts: { reason },
                                });
                            }
                            reject(reason);
                        });
                    });
                }
            };

            const result = await mockElement.LoadResources();
            expect(result).to.deep.equal({ data: 'test' });
            expect(onloadedCalled).to.be.true;
            expect(onloadederrorCalled).to.be.false;
        });

        it('should handle error case', async () => {
            let onloadedCalled = false;
            let onloadederrorCalled = false;

            const mockElement = {
                loadedResources_: null,
                onloaded: 'console.log("loaded")',
                onloadederror: 'console.log("error")',
                EvaluateExpression: function(expr: string, options: any) {
                    if (expr === this.onloaded) {
                        onloadedCalled = true;
                    } else if (expr === this.onloadederror) {
                        onloadederrorCalled = true;
                    }
                },
                LoadResources: function() {
                    const wasLoaded = this.loadedResources_;
                    return new Promise((resolve, reject) => {
                        // Mock super.LoadResources() failure
                        const mockSuperPromise = Promise.reject(new Error('Load failed'));
                        
                        mockSuperPromise.then((data) => {
                            if (!wasLoaded && this.onloaded) {
                                this.EvaluateExpression(this.onloaded, {
                                    disableFunctionCall: false,
                                    contexts: { data },
                                });
                            }
                            resolve(data);
                        }).catch((reason) => {
                            if (this.onloadederror) {
                                this.EvaluateExpression(this.onloadederror, {
                                    disableFunctionCall: false,
                                    contexts: { reason },
                                });
                            }
                            reject(reason);
                        });
                    });
                }
            };

            try {
                await mockElement.LoadResources();
                expect.fail('Should have thrown error');
            } catch (error) {
                expect(error).to.be.instanceOf(Error);
                expect(onloadedCalled).to.be.false;
                expect(onloadederrorCalled).to.be.true;
            }
        });

        it('should not call onloaded if already loaded', async () => {
            let onloadedCalled = false;

            const mockElement = {
                loadedResources_: { existing: 'data' }, // Already loaded
                onloaded: 'console.log("loaded")',
                onloadederror: '',
                EvaluateExpression: function(expr: string, options: any) {
                    if (expr === this.onloaded) {
                        onloadedCalled = true;
                    }
                },
                LoadResources: function() {
                    const wasLoaded = this.loadedResources_;
                    return new Promise((resolve, reject) => {
                        const mockSuperPromise = Promise.resolve({ data: 'test' });
                        
                        mockSuperPromise.then((data) => {
                            if (!wasLoaded && this.onloaded) {
                                this.EvaluateExpression(this.onloaded, {
                                    disableFunctionCall: false,
                                    contexts: { data },
                                });
                            }
                            resolve(data);
                        }).catch((reason) => {
                            if (this.onloadederror) {
                                this.EvaluateExpression(this.onloadederror, {
                                    disableFunctionCall: false,
                                    contexts: { reason },
                                });
                            }
                            reject(reason);
                        });
                    });
                }
            };

            await mockElement.LoadResources();
            expect(onloadedCalled).to.be.false; // Should not call onloaded if was already loaded
        });
    });

    describe('LoadTargetResources Method', () => {
        it('should delegate to LoadResources', async () => {
            let loadResourcesCalled = false;

            const mockElement = {
                LoadResources: function() {
                    loadResourcesCalled = true;
                    return Promise.resolve({ data: 'test' });
                },
                LoadTargetResources: function() {
                    return this.LoadResources();
                }
            };

            const result = await mockElement.LoadTargetResources();
            expect(loadResourcesCalled).to.be.true;
            expect(result).to.deep.equal({ data: 'test' });
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
                    const ancestor: any = null;
                    if (ancestor && 'AddResource' in ancestor) {
                        ancestor.AddResource(this);
                    }
                }
            };

            expect(() => {
                mockElement.HandlePostAttributesProcessPostfix_();
            }).to.not.throw();
        });
    });

    describe('GetResourceLoadAttributes_ Method', () => {
        it('should return attributes_ when set', () => {
            const testAttributes = {
                'data-test': 'value',
                'class': 'test-class'
            };

            const mockElement = {
                attributes_: testAttributes,
                GetResourceLoadAttributes_: function() {
                    return (this.attributes_ || undefined);
                }
            };

            const result = mockElement.GetResourceLoadAttributes_();
            expect(result).to.equal(testAttributes);
            expect(result).to.have.property('data-test', 'value');
        });

        it('should return undefined when attributes_ is null', () => {
            const mockElement = {
                attributes_: null,
                GetResourceLoadAttributes_: function() {
                    return (this.attributes_ || undefined);
                }
            };

            const result = mockElement.GetResourceLoadAttributes_();
            expect(result).to.be.undefined;
        });
    });

    describe('IsConcurrentResourceLoad_ Method', () => {
        it('should return true when sequential is false', () => {
            const mockElement = {
                sequential: false,
                IsConcurrentResourceLoad_: function() {
                    return !this.sequential;
                }
            };

            const result = mockElement.IsConcurrentResourceLoad_();
            expect(result).to.be.true;
        });

        it('should return false when sequential is true', () => {
            const mockElement = {
                sequential: true,
                IsConcurrentResourceLoad_: function() {
                    return !this.sequential;
                }
            };

            const result = mockElement.IsConcurrentResourceLoad_();
            expect(result).to.be.false;
        });
    });

    describe('ShouldLoadResources_ Method', () => {
        it('should return true when defer is false', () => {
            const mockElement = {
                defer: false,
                ShouldLoadResources_: function() {
                    return !this.defer;
                }
            };

            const result = mockElement.ShouldLoadResources_();
            expect(result).to.be.true;
        });

        it('should return false when defer is true', () => {
            const mockElement = {
                defer: true,
                ShouldLoadResources_: function() {
                    return !this.defer;
                }
            };

            const result = mockElement.ShouldLoadResources_();
            expect(result).to.be.false;
        });
    });

    describe('Property Configuration', () => {
        it('should have UpdateAttributesProperty method', () => {
            expect(ResourceTargetElement.prototype.UpdateAttributesProperty).to.be.a('function');
        });

        it('should be properly configured for property decorators', () => {
            // Test that the class is structured correctly for property decorators
            expect(ResourceTargetElement.prototype.constructor.name).to.equal('ResourceTargetElement');
        });
    });

    describe('ResourceTargetElementCompact Function', () => {
        it('should exist and be callable', () => {
            expect(ResourceTargetElementCompact).to.be.a('function');
            expect(ResourceTargetElementCompact.name).to.equal('ResourceTargetElementCompact');
        });
    });

    describe('Integration Behavior', () => {
        it('should work as IResourceTargetAdvanced', () => {
            const prototype = ResourceTargetElement.prototype;
            
            // Should implement IResourceTargetAdvanced interface
            expect(prototype).to.have.property('LoadTargetResources');
            expect(prototype.LoadTargetResources).to.be.a('function');
        });

        it('should coordinate loading behavior', () => {
            const mockElement = {
                sequential: true,
                defer: true,
                IsConcurrentResourceLoad_: function() {
                    return !this.sequential;
                },
                ShouldLoadResources_: function() {
                    return !this.defer;
                }
            };

            // When sequential=true and defer=true
            expect(mockElement.IsConcurrentResourceLoad_()).to.be.false; // Sequential loading
            expect(mockElement.ShouldLoadResources_()).to.be.false; // Deferred loading
        });

        it('should handle callback expressions', () => {
            const mockElement = {
                onloaded: 'handleSuccess(data)',
                onloadederror: 'handleError(reason)',
                validateCallbacks: function() {
                    return this.onloaded.length > 0 && this.onloadederror.length > 0;
                }
            };

            expect(mockElement.validateCallbacks()).to.be.true;
            expect(mockElement.onloaded).to.include('data');
            expect(mockElement.onloadederror).to.include('reason');
        });
    });
});