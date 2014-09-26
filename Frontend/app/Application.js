/**
 * The main application class. An instance of this class is created by app.js when it calls
 * Ext.application(). This is the ideal place to handle application launch and initialization
 * details.
 */

Ext.define(
	'FBEditor.Application',
	{
	    extend: 'Ext.app.Application',
	    name: 'FBEditor',
	    stores: [],
		listen: {
			controller: {
				'#': {
					unmatchedroute : 'onUnmatchedRoute'
				}
			}
		},

		init: function ()
		{
			var me = this;

			// родительское окно
			FBEditor.parentWindow = window.opener;

			// закрытие/обновление окна
			window.onbeforeunload = function ()
			{
				me.onbeforeunload(me);
			};

			Ext.state.Manager.setProvider(new Ext.state.CookieProvider());
			Ext.tip.QuickTipManager.init();
		},

	    launch: function ()
	    {
		    if (FBEditor.parentWindow)
		    {
			    // убираем отсоединенную панель из главного окна
			    FBEditor.parentWindow.Ext.getCmp('main').removeDetachedPanel(window);
		    }
	    },

		/**
		 * Отслеживает обращение к несуществующим хэшам роута.
		 * @param {String} hash Хэш.
		 */
		onUnmatchedRoute : function (hash)
		{
			if (FBEditor.parentWindow)
			{
				window.close();
			}
		},

		/**
		 * Выполняет необходимые действия перед закрытием окна.
		 * @param {FBEditor.Application} scope Ссылка на приложение.
		 */
		onbeforeunload: function (scope)
		{
			var me = scope;

			if (FBEditor.parentWindow && !FBEditor.closingWindow)
			{
				// флаг закрытия окна, чтобы избежать зацикливания
				FBEditor.closingWindow = true;

				me.attachPanel();
				window.close();
			}
		},

		/**
		 * Присоеденияет отсоединенную панель обратно в главное окно редактора.
		 */
		attachPanel: function ()
		{
			var panelName,
				parentPanel;

			panelName = window.name;
			parentPanel = FBEditor.parentWindow.Ext.getCmp('main');
			parentPanel.attachPanel(panelName);
		}
	}
);
