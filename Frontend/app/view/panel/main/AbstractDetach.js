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

	    /**
	     * @property {Boolean} Отсоединяемая ли панель.
	     */
	    detachable: false,

	    initComponent: function ()
	    {
		    var me = this;

		    if (me.detachable)
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
	     */
	    detachPanel: function (panel)
	    {
		    panel.fireEvent('detachpanel', panel);
	    }
    }
);