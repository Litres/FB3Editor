/**
 * Информация о файле.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.documentInfo.DocumentInfo',
	{
		extend: 'FBEditor.view.form.desc.AbstractFieldContainer',
		xtype: 'form-desc-documentInfo',

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
					name: 'documentInfo-created',
					fieldLabel: me.translateText.created
				},
				{
					xtype: 'datetimefield',
					name: 'documentInfo-updated',
					fieldLabel: me.translateText.updated
				},
				{
					xtype: 'textfield',
					name: 'documentInfo-programUsed',
					fieldLabel: me.translateText.programUsed
				},
				{
					xtype: 'textfield',
					vtype: 'url',
					name: 'documentInfo-srcUrl',
					fieldLabel: me.translateText.srcUrl
				},
				{
					xtype: 'textfield',
					name: 'documentInfo-ocr',
					fieldLabel: me.translateText.ocr
				},
				{
					xtype: 'textfield',
					name: 'documentInfo-editor',
					fieldLabel: me.translateText.editor
				}
			];
			me.callParent(arguments);
		}
	}
);