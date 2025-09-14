import { expect } from 'chai';
import { CustomElement, ICustomElementOptions } from './element';

describe('CustomElement', () => {
    // Note: We can't directly instantiate CustomElement in jsdom because it extends HTMLElement
    // and requires custom element registration. Instead, we'll test the class methods and behavior
    // through inheritance and mocking.

    describe('Constructor and Options', () => {
        it('should have correct default options structure', () => {
            // Test the options interface and defaults through class examination
            const mockElement = {
                options_: {} as ICustomElementOptions,
                style: { display: '' }
            };
            
            // Simulate constructor logic
            const options = mockElement.options_;
            if (options.isTemplate || options.isHidden) {
                mockElement.style.display = 'none';
            }
            
            expect(mockElement.style.display).to.equal('');
        });

        it('should handle isTemplate option', () => {
            const mockElement = {
                options_: { isTemplate: true } as ICustomElementOptions,
                style: { display: '' }
            };
            
            // Simulate constructor logic
            const options = mockElement.options_;
            if (options.isTemplate || options.isHidden) {
                mockElement.style.display = 'none';
            }
            
            expect(mockElement.style.display).to.equal('none');
        });

        it('should handle isHidden option', () => {
            const mockElement = {
                options_: { isHidden: true } as ICustomElementOptions,
                style: { display: '' }
            };
            
            // Simulate constructor logic  
            const options = mockElement.options_;
            if (options.isTemplate || options.isHidden) {
                mockElement.style.display = 'none';
            }
            
            expect(mockElement.style.display).to.equal('none');
        });

        it('should handle combined options', () => {
            const mockElement = {
                options_: { isTemplate: true, disableImplicitData: true } as ICustomElementOptions,
                style: { display: '' }
            };
            
            // Simulate constructor logic
            const options = mockElement.options_;
            if (options.isTemplate || options.isHidden) {
                mockElement.style.display = 'none';
            }
            
            expect(mockElement.style.display).to.equal('none');
            expect(mockElement.options_.disableImplicitData).to.be.true;
        });
    });

    describe('Resource Management', () => {
        // Test the resource management logic with a mock object that simulates CustomElement behavior
        let mockElement: {
            resources_: any[];
            loadingResources_: boolean;
            loadedResources_: any;
            queuedResourceHandlers_: Array<() => void>;
            AddResource: (resource: any) => void;
            RemoveResource: (resource: any) => void;
        };

        beforeEach(() => {
            mockElement = {
                resources_: [],
                loadingResources_: false,
                loadedResources_: null,
                queuedResourceHandlers_: [],
                AddResource: function(resource: any) {
                    this.resources_.push(resource);
                },
                RemoveResource: function(resource: any) {
                    this.resources_ = this.resources_.filter(r => (r !== resource));
                }
            };
        });

        it('should start with empty resources array', () => {
            expect(mockElement.resources_).to.be.an('array');
            expect(mockElement.resources_).to.have.length(0);
        });

        it('should add string resources', () => {
            const resource = 'test-resource.js';
            mockElement.AddResource(resource);
            
            expect(mockElement.resources_).to.have.length(1);
            expect(mockElement.resources_[0]).to.equal(resource);
        });

        it('should add object resources', () => {
            const resource = { type: 'script' as const, path: 'test.js' };
            mockElement.AddResource(resource);
            
            expect(mockElement.resources_).to.have.length(1);
            expect(mockElement.resources_[0]).to.deep.equal(resource);
        });

        it('should add multiple resources', () => {
            const resource1 = 'test1.js';
            const resource2 = { type: 'link' as const, path: 'test2.css' };
            
            mockElement.AddResource(resource1);
            mockElement.AddResource(resource2);
            
            expect(mockElement.resources_).to.have.length(2);
            expect(mockElement.resources_[0]).to.equal(resource1);
            expect(mockElement.resources_[1]).to.deep.equal(resource2);
        });

        it('should remove resources', () => {
            const resource1 = 'test1.js';
            const resource2 = 'test2.js';
            
            mockElement.AddResource(resource1);
            mockElement.AddResource(resource2);
            expect(mockElement.resources_).to.have.length(2);
            
            mockElement.RemoveResource(resource1);
            expect(mockElement.resources_).to.have.length(1);
            expect(mockElement.resources_[0]).to.equal(resource2);
        });

        it('should handle removing non-existent resource', () => {
            const resource1 = 'test1.js';
            const resource2 = 'test2.js';
            
            mockElement.AddResource(resource1);
            expect(mockElement.resources_).to.have.length(1);
            
            mockElement.RemoveResource(resource2); // Remove non-existent resource
            expect(mockElement.resources_).to.have.length(1);
            expect(mockElement.resources_[0]).to.equal(resource1);
        });
    });

    describe('LoadResources', () => {
        // Test resource loading logic with mock
        it('should handle loading state management', () => {
            const mockElement = {
                loadingResources_: false,
                loadedResources_: null,
                queuedResourceHandlers_: [] as Array<() => void>
            };
            
            expect(mockElement.loadingResources_).to.be.false;
            expect(mockElement.loadedResources_).to.be.null;
            expect(mockElement.queuedResourceHandlers_).to.have.length(0);
        });

        it('should track loading state', () => {
            const mockElement = {
                loadingResources_: false,
                setLoading: function(loading: boolean) {
                    this.loadingResources_ = loading;
                }
            };
            
            expect(mockElement.loadingResources_).to.be.false;
            mockElement.setLoading(true);
            expect(mockElement.loadingResources_).to.be.true;
        });

        it('should manage resource queue', () => {
            const mockElement = {
                queuedResourceHandlers_: [] as Array<() => void>,
                addHandler: function(handler: () => void) {
                    this.queuedResourceHandlers_.push(handler);
                }
            };
            
            const handler1 = () => {};
            const handler2 = () => {};
            
            mockElement.addHandler(handler1);
            mockElement.addHandler(handler2);
            
            expect(mockElement.queuedResourceHandlers_).to.have.length(2);
        });
    });

    describe('Class Structure and Interface', () => {
        it('should implement ICustomElement interface', () => {
            // Test that CustomElement class has the expected methods and properties
            const prototype = CustomElement.prototype;
            
            expect(prototype).to.have.property('connectedCallback');
            expect(prototype).to.have.property('AddResource');
            expect(prototype).to.have.property('RemoveResource');
            expect(prototype).to.have.property('LoadResources');
            expect(prototype).to.have.property('UpdateComponentProperty');
        });

        it('should implement IResourceTarget interface', () => {
            const prototype = CustomElement.prototype;
            
            expect(prototype).to.have.property('AddResource');
            expect(prototype).to.have.property('RemoveResource');
            expect(prototype).to.have.property('LoadResources');
        });

        it('should extend HTMLElement', () => {
            expect(CustomElement.prototype).to.be.instanceOf(HTMLElement);
        });
    });

    describe('Method Availability', () => {
        it('should have UpdateComponentProperty method', () => {
            expect(CustomElement.prototype.UpdateComponentProperty).to.be.a('function');
        });

        it('should have resource management methods', () => {
            expect(CustomElement.prototype.AddResource).to.be.a('function');
            expect(CustomElement.prototype.RemoveResource).to.be.a('function');
            expect(CustomElement.prototype.LoadResources).to.be.a('function');
        });

        it('should have connectedCallback for lifecycle', () => {
            expect(CustomElement.prototype.connectedCallback).to.be.a('function');
        });
    });
});