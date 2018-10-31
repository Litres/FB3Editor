/**
 * Инициализация приложения.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

/*
Статические переменные и функции приложения.

{String} Версия
FBEditor.version

{Boolean} Доступен ли хаб
FBEditor.accessHub

{Boolean} Загружен ли xmllint
FBEditor.xmllintResult

{Window} Родительское окно
FBEditor.parentWindow

{Object} Дочерние окна
FBEditor.childWindow

{Boolean} Флаг закрытия окна, чтобы избежать зацикливания
FBEditor.closingWindow

{Function} Мост для передачи событий в основное приложение
FBEditor.getBridgeWindow()

{Function} Мост для передачи событий в приложение панели свойств
FBEditor.getBridgeProps()

{Function} Мост для передачи событий в приложение панели навигации
FBEditor.getBridgeNavigation()

{Function} Возвращает хранилище localStorage для приложения
FBEditor.getLocalStorage()

{Function} Возвращает активный менеджер редактора текста
FBEditor.getEditorManager()

{Function} Устанавливает активный менеджер редактора текста
FBEditor.setEditorManager(manager)

*/

Ext.define(
	'FBEditor.Application',
	{
	    extend: 'Ext.app.Application',

	    name: 'FBEditor',

		requires: [
			'FBEditor.command.HistoryCommand',
			'FBEditor.csrf.Csrf',
			'FBEditor.file.Manager',
            'FBEditor.hotkeys.Manager',
			'FBEditor.resource.Manager',
			'FBEditor.route.Manager',
			'FBEditor.scroll.Scroll',
			'FBEditor.util.Ajax',
            'FBEditor.util.ClipboardData',
			'FBEditor.util.Diff',
			'FBEditor.util.Format',
            'FBEditor.util.Hotkey',
			'FBEditor.util.Img',
			'FBEditor.util.xml.Jsxml',
			'FBEditor.webworker.Manager',
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
			
			// версия
			FBEditor.version = Ext.manifest.loader ? Ext.manifest.loader.cache : 'developer';
			FBEditor.versionParam = Ext.manifest.loader ?
			                        Ext.manifest.loader.cacheParam + '=' + FBEditor.version : 'developer';

			// родительское окно
			FBEditor.parentWindow = window.opener && window.name ? window.opener : null;

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

			// инициализируем localStorage
			FBEditor.getLocalStorage = function ()
			{
				return Ext.util.LocalStorage.get('FBEditor') || new Ext.util.LocalStorage({id: 'FBEditor'});
			};

			/**
			 * Возвращает активный менеджер редактора текста.
			 * @param {Boolean} [body] Вернуть ли менеджер редактора тела кнги.
			 * @return {FBEditor.editor.view.Editor}
			 */
			FBEditor.getEditorManager = function (body)
			{
				var bridge = FBEditor.getBridgeWindow(),
					manager,
					editor;

				manager = bridge.FBEditor.activeEditorManager;

				if (!manager || body)
				{
					// по умолчанию считаем активным менеджер редактора тела книги
					editor = bridge.Ext.getCmp('main-editor');
					manager = editor.getManager();
				}

				return manager;
			};

			/**
			 * Устанавливает активный менеджер редактора текста.
			 * @param {FBEditor.editor.Manager} manager
			 */
			FBEditor.setEditorManager = function (manager)
			{
				var bridge = FBEditor.getBridgeWindow();

				bridge.FBEditor.activeEditorManager = manager;
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

			// вебворкеры
			FBEditor.webworker.Manager.init();

			// хранилище состояний компонентов
			Ext.state.Manager.setProvider(new Ext.state.CookieProvider({prefix: me.getName() + '-'}));

			// всплывающие подсказки
			//Ext.tip.QuickTipManager.init();

			// глобальная история команд
			FBEditor.command.HistoryCommand.init();

			// роуты
			FBEditor.route.Manager.init();

			// инициализируем менеджер ресурсов
			FBEditor.resource.Manager.init();

            // инициализируем менеджер горячих клавиш
            FBEditor.hotkeys.Manager.init();
            
			// получаем список токенов csrf и определяем доступность хаба
			me.initCsrf();
		},

	    launch: function ()
	    {
		    if (FBEditor.parentWindow)
		    {
			    // убираем отсоединенную панель из главного окна
			    FBEditor.parentWindow.Ext.getCmp('main').removeDetachedPanel(window);
		    }

		    // удаляем информационную заставку
		    document.querySelector('.app-loading').parentNode.removeChild(document.querySelector('.app-loading'));
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
					FBEditor.getLocalStorage().removeItem(window.name);
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
		},

		/**
		 * Получает список токенов для защиты от CSRF уязвимости приложения.
		 * Так же проверяет доступность хаба, если список доступен.
		 */
		initCsrf: function ()
		{
			var csrf = FBEditor.csrf.Csrf;
			
			// по умолчанию считаем, что хаб не доступен
			FBEditor.accessHub = false;

			// проверяем доступ к хабу
			csrf.getToken().then(
				function (token)
				{
					// токены получены - хаб доступен
					FBEditor.accessHub = true;

					// оповещаем все необходимые компоненты, что хаб доступен
					Ext.getCmp('main').fireEvent('accessHub');

					Ext.log({msg: 'Хаб доступен', level: 'info'});
                    Ext.log({msg: 'Токен CSRF ' + token, level: 'info'});
				}
			);
		},

        /**
		 * Устанаваливает заголовок окна.
         * @param {String} title Заголовок.
         */
        setTitle: function (title)
		{
			var app;

			title = title || 'Введите название книги';
			document.title = title;

			Ext.Object.each(
                FBEditor.childWindow,
				function (key, win)
				{
                    if (win)
                    {
                        app = win.FBEditor.getApplication();
                        app.setTitle(win.title + ' | ' + title);
                    }
				}
			);
		}
	}
);

(function renderingInfo ()
{
	// меняем сообщение о загрузки
	document.querySelector('.app-loading-info').firstChild.nodeValue = 'Рендеринг';
	//document.querySelector('.app-loader').style.visibility = 'hidden';
	//eval("Ext = null;");
}());