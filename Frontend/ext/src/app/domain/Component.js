/**
 * This class implements the component event domain. All classes extending from
 * {@link Ext.Component} are included in this domain. The matching criteria uses
 * {@link Ext.ComponentQuery}.
 * 
 * @private
 */
Ext.define('Ext.app.domain.Component', {
    extend: 'Ext.app.EventDomain',
    singleton: true,

    requires: [
        'Ext.Widget',
        'Ext.Component'
    ],

    type: 'component',

    constructor: function() {
        var me = this,
            Component = Ext.Component;
        
        me.callParent();

        me.monitor(Ext.Widget);

        if (!Component.prototype.isWidget) {
            // Touch Components are widgets, Ext components are not.  If components
            // are not widgets we need to monitor Ext.Component as well.
            me.monitor(Component);
        }
    },
    
    dispatch: function(target, ev, args) {
        var controller = target.lookupController(false), // don't skip target
            domain, view;
           
         
        while (controller) {
            domain = controller.compDomain;
            if (domain) {
                if (domain.dispatch(target, ev, args) === false) {
                    return false;
                }
            }
            view = controller.getView();
            controller = view ? view.lookupController(true) : null;
        }
        return this.callParent(arguments);    
    },

    match: function(target, selector) {
        return target.is(selector);
    }
});
