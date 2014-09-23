/**
 * This class is the main view for the application. It is specified in app.js as the
 * "autoCreateViewport" property. That setting automatically applies the "viewport"
 * plugin to promote that instance of this class to the body element.
 *
 * TODO - Replace this content of this view to suite the needs of your application.
 */
Ext.define('FBEditor.view.main.Main', {
    extend: 'Ext.container.Container',
    requires: [
        'FBEditor.view.main.MainController',
        'FBEditor.view.main.MainModel',
        'FBEditor.view.dockedPanel.LeftPanel',
        'FBEditor.view.dockedPanel.TopPanel',
        'FBEditor.view.dockedPanel.RightPanel',
        'FBEditor.view.dockedPanel.CenterPanel'
    ],

    xtype: 'app-main',
    
    controller: 'main',
    viewModel: {
        type: 'main'
    },

    layout: {
        type: 'absolute'
    },

    /*items: [{
        xtype: 'panel',
        bind: {
            title: '{name}'
        },
        region: 'west',
        html: '<ul><li>This area is commonly used for navigation, for example, using a "tree" component.</li></ul>',
        width: 250,
        split: true,
        tbar: [{
            text: 'Button',
            handler: 'onClickButton'
        }]
    },{
        region: 'center',
        xtype: 'tabpanel',
        items:[{
            title: 'Tab 1',
            html: '<h2>Content appropriate for the current navigation.</h2>'
        }]
    }]*/

    afterRender: function ()
    {
        var me = this;

        Ext.create('FBEditor.view.dockedPanel.LeftPanel').show();
        Ext.create('FBEditor.view.dockedPanel.TopPanel').show();
        Ext.create('FBEditor.view.dockedPanel.RightPanel').show();
        Ext.create('FBEditor.view.dockedPanel.CenterPanel').show();
        me.callParent(arguments);
    }
});
