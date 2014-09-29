/**
 * Контроллер главного контейнера.
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
	        //
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
		},

		/**
		 * Восстанавливает отсоединенную панель.
		 * @param {String} name Имя панели.
		 */
		onRestoreDetachPanel: function (name)
		{
			var me = this,
				box,
				params,
				win;

			box = localStorage.getItem(name);
			box = Ext.Object.fromQueryString(box, true);
			params = 'width=' +box.width +
				',height=' + box.height +
				',top=' + box.top +
				',left=' + box.left +
				',toolbar=no' +
				',location=no';
			win = window.open('#panel/' + name, name, params);
			if (!win)
			{
				// если окно было заблокировано браузером, то показываем панель в главном окне
				me.getView().attachPanel(name);
			}
		},

		/**
		 * Закрывает все отсоединеные панели.
		 */
		onCloseDetachPanels: function ()
		{
			var me = this,
				view,
				box;

			view = me.getView();
			Ext.Object.each(
				view.windowPanels,
				function (key, win)
				{
					if (win)
					{
						// сохраняем состояние отсоединенной панели
						box = {
							width: win.innerWidth,
							height: win.innerHeight,
							left: win.screenX,
							top: win.screenY
						};
						localStorage.setItem(key, Ext.Object.toQueryString(box, true));
						
						win.close();
					}
				}
			);
		},

		/**
		 * Добавляет на панель инструментов тулбар редактора HTML.
		 * @param {FBEditor.view.htmleditor.HtmlEditor} htmlEditor Html-редактор.
		 */
		onAddToolbar: function (htmlEditor)
		{
			var toolbar;

			toolbar = htmlEditor.getToolbar();
			Ext.getCmp('panel-main-tools').add(toolbar);
		}
	}
);
