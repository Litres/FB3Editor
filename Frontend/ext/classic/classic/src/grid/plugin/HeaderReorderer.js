/**
 * @private
 */
Ext.define('Ext.grid.plugin.HeaderReorderer', {
    extend: 'Ext.plugin.Abstract',
    requires: ['Ext.grid.header.DragZone', 'Ext.grid.header.DropZone'],
    alias: 'plugin.gridheaderreorderer',

    init: function(headerCt) {
        this.headerCt = headerCt;
        headerCt.on({
            boxready: this.onHeaderCtRender,
            single: true,
            scope: this
        });
    },

    destroy: function() {
        var me = this;
        
        // The grid may happen to never render
        me.headerCt.un('boxready', me.onHeaderCtRender, me);
        
        Ext.destroy(me.dragZone, me.dropZone);
        me.headerCt = me.dragZone = me.dropZone = null;
        
        me.callParent();
    },

    onHeaderCtRender: function() {
        var me = this;
        
        me.dragZone = new Ext.grid.header.DragZone(me.headerCt);
        me.dropZone = new Ext.grid.header.DropZone(me.headerCt);
        if (me.disabled) {
            me.dragZone.disable();
        }
    },
    
    enable: function() {
        this.disabled = false;
        if (this.dragZone) {
            this.dragZone.enable();
        }
    },
    
    disable: function() {
        this.disabled = true;
        if (this.dragZone) {
            this.dragZone.disable();
        }
    }
});
