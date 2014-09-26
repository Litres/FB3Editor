/**
 * This class is the main view for the application. It is specified in app.js as the
 * "autoCreateViewport" property. That setting automatically applies the "viewport"
 * plugin to promote that instance of this class to the body element.
 */

Ext.define(
	'FBEditor.view.main.MainController',
	{
	    extend: 'Ext.app.ViewController',
	    alias: 'controller.main',
		routes: {
			'panel/:name': {
				before: 'beforeCreatePanel',
				action: 'createPanel',
				conditions: {
					':name' : '(navigation|props)'
				}
			}
		},

	    init: function ()
	    {
	        var me = this;

	        me.callParent(arguments);
	    },

		/**
		 * Выполняет необходимые проверки перед тем как создать панель.
		 * @param {String} name Имя панели.
		 * @param {Object} action Необходимые колбэки для передачи управления.
		 */
		beforeCreatePanel: function (name, action)
		{
			if (FBEditor.parentWindow)
			{
				action.resume();
			}
		},

		/**
		 * Создает панель.
		 * @param {String} name Имя панели.
		 */
		createPanel: function (name)
		{
			var me = this,
				view;

			view = me.getView();
			view.createPanel(name);
		}
	}
);
