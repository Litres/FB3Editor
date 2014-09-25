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
			// родительское окно
			FBEditor.parentWindow = window.opener;
		},

	    launch: function ()
	    {
		    var me = this;

		    window.onbeforeunload = me.onbeforeunload;
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
		 */
		onbeforeunload: function ()
		{
			if (FBEditor.parentWindow)
			{
				localStorage.removeItem(window.name);
				window.close();
			}
		}
	}
);
