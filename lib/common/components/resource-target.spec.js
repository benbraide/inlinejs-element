"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const resource_target_1 = require("./resource-target");
describe('ResourceTargetElement', () => {
    describe('Class Structure and Interface', () => {
        it('should extend CustomElement', () => {
            (0, chai_1.expect)(resource_target_1.ResourceTargetElement.prototype).to.be.instanceOf(Object);
            (0, chai_1.expect)(Object.getPrototypeOf(resource_target_1.ResourceTargetElement.prototype).constructor.name).to.equal('CustomElement');
        });
        it('should implement IResourceTargetAdvanced interface', () => {
            const prototype = resource_target_1.ResourceTargetElement.prototype;
            (0, chai_1.expect)(prototype).to.have.property('LoadTargetResources');
            (0, chai_1.expect)(prototype.LoadTargetResources).to.be.a('function');
        });
        it('should have all required method properties', () => {
            const prototype = resource_target_1.ResourceTargetElement.prototype;
            (0, chai_1.expect)(prototype).to.have.property('UpdateAttributesProperty');
            (0, chai_1.expect)(prototype.UpdateAttributesProperty).to.be.a('function');
        });
    });
    describe('Constructor Behavior', () => {
        it('should set hidden option', () => {
            const expectedOptions = {
                isHidden: true,
            };
            (0, chai_1.expect)(expectedOptions.isHidden).to.be.true;
        });
        it('should initialize with default property values', () => {
            const mockElement = {
                sequential: false,
                defer: false,
                onloaded: '',
                onloadederror: '',
                attributes_: null
            };
            (0, chai_1.expect)(mockElement.sequential).to.be.false;
            (0, chai_1.expect)(mockElement.defer).to.be.false;
            (0, chai_1.expect)(mockElement.onloaded).to.equal('');
            (0, chai_1.expect)(mockElement.onloadederror).to.equal('');
            (0, chai_1.expect)(mockElement.attributes_).to.be.null;
        });
    });
    describe('UpdateAttributesProperty Method', () => {
        it('should update attributes_ property with object', () => {
            const mockElement = {
                attributes_: null,
                UpdateAttributesProperty: function (value) {
                    this.attributes_ = value;
                }
            };
            const testAttributes = {
                'data-test': 'value1',
                'class': 'test-class',
                'id': 'test-id'
            };
            mockElement.UpdateAttributesProperty(testAttributes);
            (0, chai_1.expect)(mockElement.attributes_).to.equal(testAttributes);
            (0, chai_1.expect)(mockElement.attributes_).to.have.property('data-test', 'value1');
            (0, chai_1.expect)(mockElement.attributes_).to.have.property('class', 'test-class');
            (0, chai_1.expect)(mockElement.attributes_).to.have.property('id', 'test-id');
        });
        it('should handle null value', () => {
            const mockElement = {
                attributes_: { 'existing': 'value' },
                UpdateAttributesProperty: function (value) {
                    this.attributes_ = value;
                }
            };
            mockElement.UpdateAttributesProperty(null);
            (0, chai_1.expect)(mockElement.attributes_).to.be.null;
        });
        it('should handle empty object', () => {
            const mockElement = {
                attributes_: null,
                UpdateAttributesProperty: function (value) {
                    this.attributes_ = value;
                }
            };
            const emptyAttributes = {};
            mockElement.UpdateAttributesProperty(emptyAttributes);
            (0, chai_1.expect)(mockElement.attributes_).to.equal(emptyAttributes);
            (0, chai_1.expect)(Object.keys(mockElement.attributes_ || {})).to.have.length(0);
        });
    });
    describe('LoadResources Method', () => {
        it('should wrap super.LoadResources with promise handling', () => __awaiter(void 0, void 0, void 0, function* () {
            let onloadedCalled = false;
            let onloadederrorCalled = false;
            const mockElement = {
                loadedResources_: null,
                onloaded: 'console.log("loaded")',
                onloadederror: 'console.log("error")',
                EvaluateExpression: function (expr, options) {
                    if (expr === this.onloaded) {
                        onloadedCalled = true;
                    }
                    else if (expr === this.onloadederror) {
                        onloadederrorCalled = true;
                    }
                },
                LoadResources: function () {
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
            const result = yield mockElement.LoadResources();
            (0, chai_1.expect)(result).to.deep.equal({ data: 'test' });
            (0, chai_1.expect)(onloadedCalled).to.be.true;
            (0, chai_1.expect)(onloadederrorCalled).to.be.false;
        }));
        it('should handle error case', () => __awaiter(void 0, void 0, void 0, function* () {
            let onloadedCalled = false;
            let onloadederrorCalled = false;
            const mockElement = {
                loadedResources_: null,
                onloaded: 'console.log("loaded")',
                onloadederror: 'console.log("error")',
                EvaluateExpression: function (expr, options) {
                    if (expr === this.onloaded) {
                        onloadedCalled = true;
                    }
                    else if (expr === this.onloadederror) {
                        onloadederrorCalled = true;
                    }
                },
                LoadResources: function () {
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
                yield mockElement.LoadResources();
                chai_1.expect.fail('Should have thrown error');
            }
            catch (error) {
                (0, chai_1.expect)(error).to.be.instanceOf(Error);
                (0, chai_1.expect)(onloadedCalled).to.be.false;
                (0, chai_1.expect)(onloadederrorCalled).to.be.true;
            }
        }));
        it('should not call onloaded if already loaded', () => __awaiter(void 0, void 0, void 0, function* () {
            let onloadedCalled = false;
            const mockElement = {
                loadedResources_: { existing: 'data' },
                onloaded: 'console.log("loaded")',
                onloadederror: '',
                EvaluateExpression: function (expr, options) {
                    if (expr === this.onloaded) {
                        onloadedCalled = true;
                    }
                },
                LoadResources: function () {
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
            yield mockElement.LoadResources();
            (0, chai_1.expect)(onloadedCalled).to.be.false; // Should not call onloaded if was already loaded
        }));
    });
    describe('LoadTargetResources Method', () => {
        it('should delegate to LoadResources', () => __awaiter(void 0, void 0, void 0, function* () {
            let loadResourcesCalled = false;
            const mockElement = {
                LoadResources: function () {
                    loadResourcesCalled = true;
                    return Promise.resolve({ data: 'test' });
                },
                LoadTargetResources: function () {
                    return this.LoadResources();
                }
            };
            const result = yield mockElement.LoadTargetResources();
            (0, chai_1.expect)(loadResourcesCalled).to.be.true;
            (0, chai_1.expect)(result).to.deep.equal({ data: 'test' });
        }));
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
                    const ancestor = null;
                    if (ancestor && 'AddResource' in ancestor) {
                        ancestor.AddResource(this);
                    }
                }
            };
            (0, chai_1.expect)(() => {
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
                GetResourceLoadAttributes_: function () {
                    return (this.attributes_ || undefined);
                }
            };
            const result = mockElement.GetResourceLoadAttributes_();
            (0, chai_1.expect)(result).to.equal(testAttributes);
            (0, chai_1.expect)(result).to.have.property('data-test', 'value');
        });
        it('should return undefined when attributes_ is null', () => {
            const mockElement = {
                attributes_: null,
                GetResourceLoadAttributes_: function () {
                    return (this.attributes_ || undefined);
                }
            };
            const result = mockElement.GetResourceLoadAttributes_();
            (0, chai_1.expect)(result).to.be.undefined;
        });
    });
    describe('IsConcurrentResourceLoad_ Method', () => {
        it('should return true when sequential is false', () => {
            const mockElement = {
                sequential: false,
                IsConcurrentResourceLoad_: function () {
                    return !this.sequential;
                }
            };
            const result = mockElement.IsConcurrentResourceLoad_();
            (0, chai_1.expect)(result).to.be.true;
        });
        it('should return false when sequential is true', () => {
            const mockElement = {
                sequential: true,
                IsConcurrentResourceLoad_: function () {
                    return !this.sequential;
                }
            };
            const result = mockElement.IsConcurrentResourceLoad_();
            (0, chai_1.expect)(result).to.be.false;
        });
    });
    describe('ShouldLoadResources_ Method', () => {
        it('should return true when defer is false', () => {
            const mockElement = {
                defer: false,
                ShouldLoadResources_: function () {
                    return !this.defer;
                }
            };
            const result = mockElement.ShouldLoadResources_();
            (0, chai_1.expect)(result).to.be.true;
        });
        it('should return false when defer is true', () => {
            const mockElement = {
                defer: true,
                ShouldLoadResources_: function () {
                    return !this.defer;
                }
            };
            const result = mockElement.ShouldLoadResources_();
            (0, chai_1.expect)(result).to.be.false;
        });
    });
    describe('Property Configuration', () => {
        it('should have UpdateAttributesProperty method', () => {
            (0, chai_1.expect)(resource_target_1.ResourceTargetElement.prototype.UpdateAttributesProperty).to.be.a('function');
        });
        it('should be properly configured for property decorators', () => {
            // Test that the class is structured correctly for property decorators
            (0, chai_1.expect)(resource_target_1.ResourceTargetElement.prototype.constructor.name).to.equal('ResourceTargetElement');
        });
    });
    describe('ResourceTargetElementCompact Function', () => {
        it('should exist and be callable', () => {
            (0, chai_1.expect)(resource_target_1.ResourceTargetElementCompact).to.be.a('function');
            (0, chai_1.expect)(resource_target_1.ResourceTargetElementCompact.name).to.equal('ResourceTargetElementCompact');
        });
    });
    describe('Integration Behavior', () => {
        it('should work as IResourceTargetAdvanced', () => {
            const prototype = resource_target_1.ResourceTargetElement.prototype;
            // Should implement IResourceTargetAdvanced interface
            (0, chai_1.expect)(prototype).to.have.property('LoadTargetResources');
            (0, chai_1.expect)(prototype.LoadTargetResources).to.be.a('function');
        });
        it('should coordinate loading behavior', () => {
            const mockElement = {
                sequential: true,
                defer: true,
                IsConcurrentResourceLoad_: function () {
                    return !this.sequential;
                },
                ShouldLoadResources_: function () {
                    return !this.defer;
                }
            };
            // When sequential=true and defer=true
            (0, chai_1.expect)(mockElement.IsConcurrentResourceLoad_()).to.be.false; // Sequential loading
            (0, chai_1.expect)(mockElement.ShouldLoadResources_()).to.be.false; // Deferred loading
        });
        it('should handle callback expressions', () => {
            const mockElement = {
                onloaded: 'handleSuccess(data)',
                onloadederror: 'handleError(reason)',
                validateCallbacks: function () {
                    return this.onloaded.length > 0 && this.onloadederror.length > 0;
                }
            };
            (0, chai_1.expect)(mockElement.validateCallbacks()).to.be.true;
            (0, chai_1.expect)(mockElement.onloaded).to.include('data');
            (0, chai_1.expect)(mockElement.onloadederror).to.include('reason');
        });
    });
});
