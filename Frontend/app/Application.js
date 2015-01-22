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
		requires: [
			'FBEditor.file.Manager',
			'FBEditor.command.HistoryCommand'
		],
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

			var Module = {
				xml: '<?xml version="1.0"?><coment><author>author</author><content>nothing</content></coment>',
				schema: '<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema"><xs:element name="comment"><xs:complexType><xs:all><xs:element name="author" type="xs:string"/><xs:element name="content" type="xs:string"/></xs:all></xs:complexType></xs:element></xs:schema>',
				arguments: ["--noout", "--schema", 'schemaFileName', 'xmlFileName']
			};

			//and call function
			//var xmllint = validateXML(Module);
			//console.log(xmllint);

			// родительское окно
			FBEditor.parentWindow = window.opener;

			// мост для передачи событий нужному окну
			FBEditor.getBridgeWindow = function ()
			{
				return FBEditor.parentWindow || window;
			};

			// закрытие/обновление окна
			window.onbeforeunload = function ()
			{
				me.onbeforeunload(me);
			};

			Ext.state.Manager.setProvider(new Ext.state.CookieProvider({prefix: me.getName() + '-'}));
			Ext.tip.QuickTipManager.init();
			FBEditor.command.HistoryCommand.init();
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
				// процесс закрытия отсоединенной панели

				// флаг закрытия окна, чтобы избежать зацикливания
				FBEditor.closingWindow = true;

				if (!FBEditor.parentWindow.FBEditor.closingWindow)
				{
					// присоединяем отсоединенную панель обратно в главное окно редактора
					FBEditor.parentWindow.Ext.getCmp('main').attachPanel(window.name);

					// удаляем сохраненное состояние отсоединенной панели
					localStorage.removeItem(window.name);
				}

				// принудительно закрываем окно, даже если оно было обновлено
				window.close();
			}
			else
			{
				// процесс закрытия основного окна редактора

				FBEditor.closingWindow = true;
				Ext.getCmp('main').fireEvent('closeapplication');
			}
		}
	}
);
