/**
 * Контроллер панели контента.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.content.ContentController',
	{
		extend: 'Ext.app.ViewController',
		alias: 'controller.panel.main.content',

		/**
		 * Вызывается при изменении размеров контейнера.
		 * @param {FBEditor.view.panel.main.content.Content} cmp Центральная панель.
		 * @param {Number} width
		 * @param {Number} height
		 * @param {Number} oldWidth
		 * @param {Number} oldHeight
		 */
		onResize: function (cmp, width, height, oldWidth, oldHeight)
		{
			if (width !== oldWidth)
			{
				//console.log('resize', width, cmp.getMinWidth());
				if (width < cmp.getMinWidth())
				{
					// ширина панели не может быть меньше минимальной
					cmp.setWidth(cmp.getMinWidth());
				}
			}
		},

		/**
		 * Переключает контент на текст книги.
		 */
		onContentBody: function ()
		{
			var me = this,
				view = me.getView(),
				panelToolstab = view.getPanelMainToolstab(),
				toolstab = view.getToolstab(),
				manager = FBEditor.getEditorManager(true),
				editor,
				toolbar;

			view.setActiveItem('main-editor');
			panelToolstab.setActiveItem('panel-toolstab-main');

			// активируем тулбар тела книги
			editor = manager.getEditor();
			toolbar = editor.getToolbar();
			toolstab.setActiveToolbar(toolbar);
			//manager.syncButtons();
		},

		/**
		 * Переключает контент на описание книги.
		 */
		onContentDesc: function ()
		{
			var me = this,
				view = me.getView(),
				panelToolstab = view.getPanelMainToolstab(),
				toolstab = view.getToolstab(),
				manager,
				editor,
				toolbar;

			view.setActiveItem('form-desc');
			panelToolstab.setActiveItem('panel-toolstab-main');

			// активируем тулбар аннотации
			editor = Ext.getCmp('form-desc-annotation').getBodyEditor();
			toolbar = editor.getToolbar();
			toolstab.setActiveToolbar(toolbar);
			manager = editor.getManager();
			manager.syncButtons();
		},

		/**
		 * Переключает контент на ресурсы книги.
		 */
		onContentResources: function ()
		{
			var me = this,
				view = me.getView(),
				toolstab = view.getToolstab(),
				manager,
				editor,
				toolbar;

			view.setActiveItem('panel-resources');

			// блокируем кнопки форматирования
			toolbar = toolstab.getActiveToolbar();

			if (toolbar)
			{
				editor = toolbar.getEditor();
				manager = editor.getManager();
				manager.disableButtons();
			}

		},

		/**
		 * Переключает контент на пустую панель.
		 */
		onContentEmpty: function ()
		{
			var me = this,
				view = me.getView();

			view.setActiveItem('panel-empty');
		}
    }
);