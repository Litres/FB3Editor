Ext.define('Ext.rtl.layout.container.VBox', {
    override: 'Ext.layout.container.VBox',

    rtlNames: {
        beforeY: 'right',
        afterY: 'left',
        scrollTo: 'rtlScrollTo'
    }
});