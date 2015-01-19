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
		onContentEditor: function ()
		{
			var me = this,
				view = me.getView();

			view.setActiveItem(0);
			Ext.getCmp('panel-main-toolstab').setActiveItem('panel-toolstab-main');
		},

		/**
		 * Переключает контент на описание книги.
		 */
		onContentDesc: function ()
		{
			var me = this,
				view = me.getView();

			view.setActiveItem(1);
			Ext.getCmp('panel-main-toolstab').setActiveItem('panel-toolstab-file');
		}
    }
);