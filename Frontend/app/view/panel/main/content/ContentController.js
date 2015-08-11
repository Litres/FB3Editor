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
				manager = FBEditor.editor.Manager;

			view.setActiveItem('main-editor');
			Ext.getCmp('panel-main-toolstab').setActiveItem('panel-toolstab-main');
			manager.syncButtons();
		},

		/**
		 * Переключает контент на описание книги.
		 */
		onContentDesc: function ()
		{
			var me = this,
				view = me.getView(),
				manager = FBEditor.editor.Manager;

			view.setActiveItem('form-desc');
			Ext.getCmp('panel-main-toolstab').setActiveItem('panel-toolstab-file');
			manager.disableButtons();
		},

		/**
		 * Переключает контент на ресурсы книги.
		 */
		onContentResources: function ()
		{
			var me = this,
				view = me.getView(),
				manager = FBEditor.editor.Manager;

			view.setActiveItem('panel-resources');
			Ext.getCmp('panel-main-toolstab').setActiveItem('panel-toolstab-file');
			manager.disableButtons();
		},

		/**
		 * Переключает контент на пустую панель.
		 */
		onContentEmpty: function ()
		{
			var me = this,
				view = me.getView(),
				manager = FBEditor.editor.Manager;

			view.setActiveItem('panel-empty');
			manager.disableButtons();
		}
    }
);