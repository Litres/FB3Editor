/**
 * Контроллер кнопки открытия файла.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.toolstab.file.button.open.OpenController',
	{
		extend: 'Ext.app.ViewController',
		alias: 'controller.panel.toolstab.file.button.open',
		requires: [
			'FBEditor.file.Manager',
			'FBEditor.file.File'
		],

		/**
		 * Открывает файл.
		 * @param {FBEditor.view.panel.toolstab.file.button.open.Open} btn Кнопка.
		 * @param {Object} evt Объект события.
		 */
		onChange: function (btn, evt)
		{
			var me = this,
				fileManager,
				file;

			fileManager = me.getFileManager();
			file = fileManager.getFileFromEvent(evt);
			file.read(
				{
					type: file.LOAD_TYPE_TEXT,
					load: function (text)
					{
						Ext.getCmp('main-htmleditor').fireEvent('loadtext', text);
					}
				}
			);
		},

		/**
		 * Менеджер файлов.
		 * @return {FBEditor.file.Manager}
		 */
		getFileManager: function ()
		{
			return FBEditor.file.Manager;
		}
	}
);