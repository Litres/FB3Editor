/**
 * This class is the main view for the application. It is specified in app.js as the
 * "autoCreateViewport" property. That setting automatically applies the "viewport"
 * plugin to promote that instance of this class to the body element.
 */
Ext.define('FBEditor.view.main.Main', {
    extend: 'Ext.container.Container',
    requires: [
        'FBEditor.view.main.MainController',
        'FBEditor.view.main.MainModel',
	    'FBEditor.view.panel.main.TopPanel',
        'FBEditor.view.panel.main.LeftPanel',
	    'FBEditor.view.panel.main.CenterPanel',
        'FBEditor.view.panel.main.RightPanel'
    ],
    xtype: 'app-main',
    controller: 'main',
    viewModel: {
        type: 'main'
    },
    layout: {
        type: 'border'
    },

    initComponent: function ()
    {
        var me = this,
	        topPanel,
	        leftPanel,
	        centerPanel,
	        rightPanel;

	    topPanel = Ext.create('FBEditor.view.panel.main.TopPanel');
	    leftPanel = Ext.create('FBEditor.view.panel.main.LeftPanel');
	    centerPanel = Ext.create('FBEditor.view.panel.main.CenterPanel');
	    rightPanel = Ext.create('FBEditor.view.panel.main.RightPanel');
	    me.items = [
		    topPanel,
		    leftPanel,
		    centerPanel,
		    rightPanel
	    ];
        me.callParent(arguments);
    }
});
