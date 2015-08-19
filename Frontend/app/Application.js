/**
 * Инициализация приложения.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.Application',
	{
	    extend: 'Ext.app.Application',
	    name: 'FBEditor',
		requires: [
			'FBEditor.command.HistoryCommand',
			'FBEditor.desc.Manager',
			'FBEditor.editor.Manager',
			'FBEditor.file.Manager',
			'FBEditor.resource.Manager',
			'FBEditor.util.xml.Jsxml',
			'FBEditor.util.Format',
			'FBEditor.xsl.Body',
			'FBEditor.xsd.Desc'
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

			// родительское окно
			FBEditor.parentWindow = window.opener;

			// ссылки на дочернии окна
			FBEditor.childWindow = {
				navigation: null,
				props: null
			};

			// мост для передачи событий в основное приложение
			FBEditor.getBridgeWindow = function ()
			{
				return FBEditor.parentWindow || window;
			};

			// мост для передачи событий в приложение панели свойств
			FBEditor.getBridgeProps = function ()
			{
				var win;

				win = FBEditor.parentWindow ?
				      (FBEditor.parentWindow.FBEditor.childWindow.props || FBEditor.parentWindow) :
				      (FBEditor.childWindow.props || window);

				return win;
			};

			// мост для передачи событий в приложение панели навигации
			FBEditor.getBridgeNavigation = function ()
			{
				return FBEditor.parentWindow ?
				       (FBEditor.parentWindow.FBEditor.childWindow.navigation || FBEditor.parentWindow) :
				       (FBEditor.childWindow.navigation || window);
			};

			// закрытие/обновление окна
			window.onbeforeunload = function ()
			{
				me.onbeforeunload(me);
			};

			window.onfocus = function ()
			{
				me.onfocus();
			};

			Ext.state.Manager.setProvider(new Ext.state.CookieProvider({prefix: me.getName() + '-'}));
			Ext.tip.QuickTipManager.init();
			FBEditor.command.HistoryCommand.init();
			FBEditor.desc.Manager.init();
			FBEditor.editor.Manager.init();
		},

	    launch: function ()
	    {
		    if (FBEditor.parentWindow)
		    {
			    // убираем отсоединенную панель из главного окна
			    FBEditor.parentWindow.Ext.getCmp('main').removeDetachedPanel(window);
		    }
		    else
		    {
			    FBEditor.desc.Manager.launch();
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
			if (FBEditor.parentWindow && !FBEditor.closingWindow)
			{
				// процесс закрытия отсоединенной панели

				// флаг закрытия окна, чтобы избежать зацикливания
				FBEditor.closingWindow = true;

				if (!FBEditor.parentWindow.FBEditor.closingWindow)
				{
					if (window.name === 'navigation')
					{
						Ext.getCmp('panel-resources-navigation').destroy();
						Ext.getCmp('panel-body-navigation').destroy();
					}

					// присоединяем отсоединенную панель обратно в главное окно редактора
					FBEditor.parentWindow.Ext.getCmp('main').attachPanel(window.name, window);

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
		},

		/**
		 * Вызывается при получении фокуса окном.
		 */
		onfocus: function ()
		{
			//фокус на главном окне
			if (!window.name)
			{
				//
			}
		}
	}
);
