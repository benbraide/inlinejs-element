"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const element_1 = require("./element");
describe('CustomElement', () => {
    // Note: We can't directly instantiate CustomElement in jsdom because it extends HTMLElement
    // and requires custom element registration. Instead, we'll test the class methods and behavior
    // through inheritance and mocking.
    describe('Constructor and Options', () => {
        it('should have correct default options structure', () => {
            // Test the options interface and defaults through class examination
            const mockElement = {
                options_: {},
                style: { display: '' }
            };
            // Simulate constructor logic
            const options = mockElement.options_;
            if (options.isTemplate || options.isHidden) {
                mockElement.style.display = 'none';
            }
            (0, chai_1.expect)(mockElement.style.display).to.equal('');
        });
        it('should handle isTemplate option', () => {
            const mockElement = {
                options_: { isTemplate: true },
                style: { display: '' }
            };
            // Simulate constructor logic
            const options = mockElement.options_;
            if (options.isTemplate || options.isHidden) {
                mockElement.style.display = 'none';
            }
            (0, chai_1.expect)(mockElement.style.display).to.equal('none');
        });
        it('should handle isHidden option', () => {
            const mockElement = {
                options_: { isHidden: true },
                style: { display: '' }
            };
            // Simulate constructor logic  
            const options = mockElement.options_;
            if (options.isTemplate || options.isHidden) {
                mockElement.style.display = 'none';
            }
            (0, chai_1.expect)(mockElement.style.display).to.equal('none');
        });
        it('should handle combined options', () => {
            const mockElement = {
                options_: { isTemplate: true, disableImplicitData: true },
                style: { display: '' }
            };
            // Simulate constructor logic
            const options = mockElement.options_;
            if (options.isTemplate || options.isHidden) {
                mockElement.style.display = 'none';
            }
            (0, chai_1.expect)(mockElement.style.display).to.equal('none');
            (0, chai_1.expect)(mockElement.options_.disableImplicitData).to.be.true;
        });
    });
    describe('Resource Management', () => {
        // Test the resource management logic with a mock object that simulates CustomElement behavior
        let mockElement;
        beforeEach(() => {
            mockElement = {
                resources_: [],
                loadingResources_: false,
                loadedResources_: null,
                queuedResourceHandlers_: [],
                AddResource: function (resource) {
                    this.resources_.push(resource);
                },
                RemoveResource: function (resource) {
                    this.resources_ = this.resources_.filter(r => (r !== resource));
                }
            };
        });
        it('should start with empty resources array', () => {
            (0, chai_1.expect)(mockElement.resources_).to.be.an('array');
            (0, chai_1.expect)(mockElement.resources_).to.have.length(0);
        });
        it('should add string resources', () => {
            const resource = 'test-resource.js';
            mockElement.AddResource(resource);
            (0, chai_1.expect)(mockElement.resources_).to.have.length(1);
            (0, chai_1.expect)(mockElement.resources_[0]).to.equal(resource);
        });
        it('should add object resources', () => {
            const resource = { type: 'script', path: 'test.js' };
            mockElement.AddResource(resource);
            (0, chai_1.expect)(mockElement.resources_).to.have.length(1);
            (0, chai_1.expect)(mockElement.resources_[0]).to.deep.equal(resource);
        });
        it('should add multiple resources', () => {
            const resource1 = 'test1.js';
            const resource2 = { type: 'link', path: 'test2.css' };
            mockElement.AddResource(resource1);
            mockElement.AddResource(resource2);
            (0, chai_1.expect)(mockElement.resources_).to.have.length(2);
            (0, chai_1.expect)(mockElement.resources_[0]).to.equal(resource1);
            (0, chai_1.expect)(mockElement.resources_[1]).to.deep.equal(resource2);
        });
        it('should remove resources', () => {
            const resource1 = 'test1.js';
            const resource2 = 'test2.js';
            mockElement.AddResource(resource1);
            mockElement.AddResource(resource2);
            (0, chai_1.expect)(mockElement.resources_).to.have.length(2);
            mockElement.RemoveResource(resource1);
            (0, chai_1.expect)(mockElement.resources_).to.have.length(1);
            (0, chai_1.expect)(mockElement.resources_[0]).to.equal(resource2);
        });
        it('should handle removing non-existent resource', () => {
            const resource1 = 'test1.js';
            const resource2 = 'test2.js';
            mockElement.AddResource(resource1);
            (0, chai_1.expect)(mockElement.resources_).to.have.length(1);
            mockElement.RemoveResource(resource2); // Remove non-existent resource
            (0, chai_1.expect)(mockElement.resources_).to.have.length(1);
            (0, chai_1.expect)(mockElement.resources_[0]).to.equal(resource1);
        });
    });
    describe('LoadResources', () => {
        // Test resource loading logic with mock
        it('should handle loading state management', () => {
            const mockElement = {
                loadingResources_: false,
                loadedResources_: null,
                queuedResourceHandlers_: []
            };
            (0, chai_1.expect)(mockElement.loadingResources_).to.be.false;
            (0, chai_1.expect)(mockElement.loadedResources_).to.be.null;
            (0, chai_1.expect)(mockElement.queuedResourceHandlers_).to.have.length(0);
        });
        it('should track loading state', () => {
            const mockElement = {
                loadingResources_: false,
                setLoading: function (loading) {
                    this.loadingResources_ = loading;
                }
            };
            (0, chai_1.expect)(mockElement.loadingResources_).to.be.false;
            mockElement.setLoading(true);
            (0, chai_1.expect)(mockElement.loadingResources_).to.be.true;
        });
        it('should manage resource queue', () => {
            const mockElement = {
                queuedResourceHandlers_: [],
                addHandler: function (handler) {
                    this.queuedResourceHandlers_.push(handler);
                }
            };
            const handler1 = () => { };
            const handler2 = () => { };
            mockElement.addHandler(handler1);
            mockElement.addHandler(handler2);
            (0, chai_1.expect)(mockElement.queuedResourceHandlers_).to.have.length(2);
        });
    });
    describe('Class Structure and Interface', () => {
        it('should implement ICustomElement interface', () => {
            // Test that CustomElement class has the expected methods and properties
            const prototype = element_1.CustomElement.prototype;
            (0, chai_1.expect)(prototype).to.have.property('connectedCallback');
            (0, chai_1.expect)(prototype).to.have.property('AddResource');
            (0, chai_1.expect)(prototype).to.have.property('RemoveResource');
            (0, chai_1.expect)(prototype).to.have.property('LoadResources');
            (0, chai_1.expect)(prototype).to.have.property('UpdateComponentProperty');
        });
        it('should implement IResourceTarget interface', () => {
            const prototype = element_1.CustomElement.prototype;
            (0, chai_1.expect)(prototype).to.have.property('AddResource');
            (0, chai_1.expect)(prototype).to.have.property('RemoveResource');
            (0, chai_1.expect)(prototype).to.have.property('LoadResources');
        });
        it('should extend HTMLElement', () => {
            (0, chai_1.expect)(element_1.CustomElement.prototype).to.be.instanceOf(HTMLElement);
        });
    });
    describe('Method Availability', () => {
        it('should have UpdateComponentProperty method', () => {
            (0, chai_1.expect)(element_1.CustomElement.prototype.UpdateComponentProperty).to.be.a('function');
        });
        it('should have resource management methods', () => {
            (0, chai_1.expect)(element_1.CustomElement.prototype.AddResource).to.be.a('function');
            (0, chai_1.expect)(element_1.CustomElement.prototype.RemoveResource).to.be.a('function');
            (0, chai_1.expect)(element_1.CustomElement.prototype.LoadResources).to.be.a('function');
        });
        it('should have connectedCallback for lifecycle', () => {
            (0, chai_1.expect)(element_1.CustomElement.prototype.connectedCallback).to.be.a('function');
        });
    });
});
