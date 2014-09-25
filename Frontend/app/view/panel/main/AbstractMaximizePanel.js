/**
 * Абстрактный класс основной отсоединяемой панели.
 *
 * @abstract
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
    'FBEditor.view.panel.main.AbstractMaximizePanel',
    {
        extend: 'FBEditor.view.panel.main.AbstractPanel',

	    initComponent: function ()
	    {
		    var me = this;

		    if (me.maximize)
		    {
			    me.tools = [
				    {
					    type: 'maximize',
					    callback: me.maximizePanel
				    }
			    ];
		    }
		    me.callParent(arguments);
	    },

	    /**
	     * Открывает панель в отдельном окне.
	     * @param {FBEditor.view.panel.main.AbstractPanel} panel Панель.
	     * @param {Ext.panel.Tool} tool Инструменты на панели.
	     * @param {Ext.event.Event} event Объект события.
	     */
	    maximizePanel: function (panel, tool, event)
	    {
		    var me = this,
			    name;

		    name = panel.panelName;
		    panel.close();
		    window.open('#panel/' + name, name, 'top=30');
	    }
    }
);