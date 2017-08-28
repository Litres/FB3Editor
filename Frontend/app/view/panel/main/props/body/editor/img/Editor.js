/**
 * Панель редактирования элемента img.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.props.body.editor.img.Editor',
	{
		extend: 'FBEditor.view.panel.main.props.body.editor.AbstractEditor',
		requires: [
			'FBEditor.view.panel.main.props.body.editor.fields.sizeselect.SizeSelect',
			'FBEditor.view.panel.main.props.body.editor.img.picture.Picture'
		],
		
		xtype: 'panel-props-body-editor-img',

		/**
		 * @property {String} Префикс перед именами полей.
		 */
		prefixName: '',

		/**
		 * @private
		 * @property {FBEditor.view.panel.main.props.body.editor.img.picture.Picture} Компонент изображения.
		 */
		picture: null,

		translateText: {
			emptyImg: 'Пустое изображение',
			alt: 'Альтернативный текст',
			width: 'Ширина',
			minWidth: 'Мин. ширина',
			maxWidth: 'Макс. ширина'
		},

		initComponent: function ()
		{
			var me = this;

			me.items = [
				{
					xtype: 'panel-props-body-editor-img-picture'
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
					xtype: 'panel-props-body-editor-fields-id',
					name: me.prefixName + 'id'
				},
				{
					name: me.prefixName + 'alt',
					fieldLabel: me.translateText.alt,
					anchor: '100%'
				},
				{
					xtype: 'panel-props-body-editor-fields-sizeselect',
					labelAlign: 'left',
					fieldLabel: me.translateText.width,
					name: me.prefixName + 'width'
				},
				{
					xtype: 'panel-props-body-editor-fields-sizeselect',
					labelAlign: 'left',
					fieldLabel: me.translateText.minWidth,
					name: me.prefixName + 'min-width'
				},
				{
					xtype: 'panel-props-body-editor-fields-sizeselect',
					labelAlign: 'left',
					fieldLabel: me.translateText.maxWidth,
					name: me.prefixName + 'max-width'
				}
			];

			me.callParent(arguments);
		},

		updateData: function (data, isLoad)
		{
			var me = this,
				prefix = me.prefixName,
				prefixData = {},
				form,
				picture;

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

			form = me.getForm();
			form.setValues(prefixData);

			// обновляем изображение
			picture = me.getPicture();
			picture.updateView({url: data.url});

			me.isLoad = false;
		},

		/**
		 * Сбрасывает данные формы.
		 */
		reset: function ()
		{
			var me = this,
				emptyData;

			emptyData = {
				url: 'undefined'
			};

			// сбрасываем изображение
			me.updateData(emptyData);

			me.callParent(arguments);
		},

		/**
		 * Возвращает компонент изображения.
		 * @return {FBEditor.view.panel.main.props.body.editor.img.picture.Picture}
		 */
		getPicture: function ()
		{
			var me = this,
				picture;

			picture = me.picture || me.down('panel-props-body-editor-img-picture');

			return picture;
		}
	}
);