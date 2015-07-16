/**
 * Панель редактирования элемента img.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.props.body.editor.img.Editor',
	{
		extend: 'FBEditor.view.panel.main.props.body.editor.AbstractEditor',
		xtype: 'panel-props-body-editor-img',

		/**
		 * @property {String} Префикс перед именами полей.
		 */
		prefixName: '',

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
					name: me.prefixName + 'name',
					value: me.translateText.emptyImg,
					listeners: {} // не реагировать на изменения поля
				},
				{
					xtype: 'hidden',
					name: me.prefixName + 'src',
					value: 'undefined',
					submitValue: true
				},
				{
					name: me.prefixName + 'id',
					fieldLabel: 'ID',
					anchor: '100%'
				},
				{
					name: me.prefixName + 'alt',
					fieldLabel: me.translateText.alt,
					anchor: '100%'
				},
				{
					name: me.prefixName + 'width',
					labelAlign: 'left',
					fieldLabel: me.translateText.width,
					regex: /^\d+(\.\d+)?(em|ex|%|mm)$/,
					regexText: me.translateText.widthError,
					style: {
						marginTop: '15px'
					}
				},
				{
					name: me.prefixName + 'min-width',
					labelAlign: 'left',
					fieldLabel: me.translateText.minWidth,
					regex: /^\d+(\.\d+)?(em|ex|%|mm)$/,
					regexText: me.translateText.widthError
				},
				{
					name: me.prefixName + 'max-width',
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
				prefix = me.prefixName,
				prefixData = {};

			me.isLoad = isLoad;
			me.element = data.el ? data.el : me.element;
			data.src = data.src ? data.src : data.name;
			data.url = data.url ? data.url : data.src;
			data[prefix + 'name'] = data.name ? data.name : me.translateText.emptyImg;

			// проставляем префиксы
			Ext.Object.each(
				data,
			    function (key, val)
			    {
				    prefixData[prefix + key] = val;
			    }
			);

			me.getForm().setValues(prefixData);
			me.down('image-editor-picture').updateView({url: data.url});
			me.isLoad = false;
		},

		/**
		 * Сбрасывает данные формы.
		 */
		reset: function ()
		{
			var me = this,
				emptyData;

			// сбрасываем изображение
			emptyData = {
				url: 'undefined'
			};
			me.updateData(emptyData);

			me.callParent(arguments);
		}
	}
);