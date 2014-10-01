/**
 * Вкладка панели иснтрументов для работы с документами.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.toolstab.file.File',
	{
		extend: 'Ext.panel.Panel',
		id:'panel-toolstab-file',
		xtype: 'panel-toolstab-file',
		title: 'Файл',

		initComponent: function ()
		{
			var me = this;

			me.tbar = [
				{
					xtype: 'filebutton',
					text: 'Открыть',
					listeners: {
						change: function (btn, evt)
						{
							var file,
								fr,
								text;

							if (evt.target.files.length)
							{
								file = evt.target.files[0];
								fr = new FileReader();
								fr.file = file;
								fr.readAsText(file, 'windows-1251');
								fr.onload = function ()
								{
									text = fr.result;
									Ext.getCmp('main-htmleditor').setValue(text);
								};
							}
						}
					}
				}
			];
			me.callParent(arguments);
		}
	}
);