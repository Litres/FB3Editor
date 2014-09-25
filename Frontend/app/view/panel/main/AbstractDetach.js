/**
 * Абстрактный класс основной отсоединяемой панели.
 *
 * @abstract
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
    'FBEditor.view.panel.main.AbstractDetach',
    {
        extend: 'FBEditor.view.panel.main.Abstract',
	    listeners: {
			detachpanel: 'onDetachPanel'
	    },

	    initComponent: function ()
	    {
		    var me = this;

		    if (me.maximize)
		    {
			    me.tools = [
				    {
					    type: 'maximize',
					    callback: me.detachPanel
				    }
			    ];
		    }
		    me.callParent(arguments);
	    },

	    /**
	     * Открывает панель в отдельном окне.
	     * @param {FBEditor.view.panel.main.Abstract} panel Панель.
	     * @param {Ext.panel.Tool} tool Инструменты на панели.
	     * @param {Ext.event.Event} event Объект события.
	     */
	    detachPanel: function (panel, tool, event)
	    {
		    panel.fireEvent('detachpanel', panel);
	    }
    }
);