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
			var me = this,
				labelStyleAllow = me.fieldDefaults.labelStyle + '; color: ' +
				                  FBEditor.view.form.desc.Desc.ALLOW_COLOR;

			me.items = [
				{
					xtype: 'datetimefield',
					name: 'documentInfo-created',
					fieldLabel: me.translateText.created,
					layout: 'hbox',
					combineErrors: true,
					msgTarget: 'side',
					defaults: {
						allowBlank: false,
						flex: 1,
						msgTarget: 'none',
						margin: '0 2 0 0'
					}
				},
				{
					xtype: 'datetimefield',
					name: 'documentInfo-updated',
					fieldLabel: me.translateText.updated,
					layout: 'hbox',
					combineErrors: true,
					msgTarget: 'side',
					defaults: {
						allowBlank: false,
						flex: 1,
						msgTarget: 'none',
						margin: '0 2 0 0'
					}
				},
				{
					xtype: 'textfield',
					name: 'documentInfo-programUsed',
					fieldLabel: me.translateText.programUsed,
					labelStyle: labelStyleAllow
				},
				{
					vtype: 'url',
					name: 'documentInfo-srcUrl',
					fieldLabel: me.translateText.srcUrl,
					labelStyle: labelStyleAllow
				},
				{
					name: 'documentInfo-ocr',
					fieldLabel: me.translateText.ocr,
					labelStyle: labelStyleAllow
				},
				{
					name: 'documentInfo-editor',
					fieldLabel: me.translateText.editor,
					labelStyle: labelStyleAllow
				}
			];
			me.callParent(arguments);
		}
	}
);