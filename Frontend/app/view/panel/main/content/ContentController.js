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
		 * Переключает контент на текст книги.
		 */
		onContentBody: function ()
		{
			var me = this,
				view = me.getView();

			view.setActiveItem('main-htmleditor');
			Ext.getCmp('panel-main-toolstab').setActiveItem('panel-toolstab-main');
		},

		/**
		 * Переключает контент на описание книги.
		 */
		onContentDesc: function ()
		{
			var me = this,
				view = me.getView();

			view.setActiveItem('form-desc');
			Ext.getCmp('panel-main-toolstab').setActiveItem('panel-toolstab-file');
		},

		/**
		 * Переключает контент на ресурсы книги.
		 */
		onContentResources: function ()
		{
			var me = this,
				view = me.getView();

			view.setActiveItem('panel-resources');
			Ext.getCmp('panel-main-toolstab').setActiveItem('panel-toolstab-file');
		}
    }
);