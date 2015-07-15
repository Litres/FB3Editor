/**
 * Панель редактирования элемента img.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.props.body.editor.img.Editor',
	{
		extend: 'FBEditor.view.panel.main.props.body.editor.AbstractEditor',

		translateText: {
			emptyImg: 'Пустое изображение',
			alt: 'Альтернативный текст',
			width: 'Ширина',
			minWidth: 'Мин. ширина',
			maxWidth: 'Макс. ширина',
			widthError: 'По шаблону \d+(\.\d+)?(em|ex|%|mm). Например: 1.5em'
		},

		initComponent: function ()
		{
			var me = this;

			me.items = [
				{
					xtype: 'image-editor-picture'
				},
				{
					xtype: 'button-editor-select-img',
					scope: me,
					style: {
						marginLeft: '10px'
					}
				},
				{
					xtype: 'displayfield',
					name: 'src',
					value: me.translateText.emptyImg,
					submitValue: true
				},
				{
					name: 'id',
					fieldLabel: 'ID',
					anchor: '100%'
				},
				{
					name: 'alt',
					fieldLabel: me.translateText.alt,
					anchor: '100%'
				},
				{
					name: 'width',
					labelAlign: 'left',
					fieldLabel: me.translateText.width,
					regex: /^\d+(\.\d+)?(em|ex|%|mm)$/,
					regexText: me.translateText.widthError,
					style: {
						marginTop: '15px'
					}
				},
				{
					name: 'min-width',
					labelAlign: 'left',
					fieldLabel: me.translateText.minWidth,
					regex: /^\d+(\.\d+)?(em|ex|%|mm)$/,
					regexText: me.translateText.widthError
				},
				{
					name: 'max-width',
					labelAlign: 'left',
					fieldLabel: me.translateText.maxWidth,
					regex: /^\d+(\.\d+)?(em|ex|%|mm)$/,
					regexText: me.translateText.widthError
				}
			];

			me.callParent(arguments);
		},

		updateData: function (data, isLoad)
		{
			var me = this,
				name;

			me.callParent(arguments);
			name = data.name ? data.name : me.translateText.emptyImg;
			me.getForm().setValues(data);
			me.down('[name=src]').setValue(name);
			me.down('image-editor-picture').updateView(data);
			me.isLoad = false;
		}
	}
);