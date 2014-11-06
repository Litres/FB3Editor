/**
 * Информация о файле.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.info.Info',
	{
		extend: 'FBEditor.view.form.desc.AbstractFieldContainer',
		xtype: 'form-desc-info',

		translateText: {
			created: 'Создан',
			updated: 'Обновлен',
			programUsed: 'Программа',
			srcUrl: 'URL',
			ocr: 'OCR',
			editor: 'Редактор'
		},

		initComponent: function ()
		{
			var me = this;

			me.items = [
				{
					xtype: 'datetimefield',
					name: 'info-created',
					fieldLabel: me.translateText.created
				},
				{
					xtype: 'datetimefield',
					name: 'info-updated',
					fieldLabel: me.translateText.updated
				},
				{
					xtype: 'textfield',
					name: 'info-programUsed',
					fieldLabel: me.translateText.programUsed
				},
				{
					xtype: 'textfield',
					vtype: 'url',
					name: 'info-srcUrl',
					fieldLabel: me.translateText.srcUrl
				},
				{
					xtype: 'textfield',
					name: 'info-ocr',
					fieldLabel: me.translateText.ocr
				},
				{
					xtype: 'textfield',
					name: 'info-editor',
					fieldLabel: me.translateText.editor
				}
			];
			me.callParent(arguments);
		}
	}
);