/**
 * Окно создания изображения.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.window.img.Create',
	{
		extend: 'Ext.Window',
		requires: [
			'FBEditor.view.image.editor.Picture',
		    'FBEditor.view.button.editor.SelectImg'
		],

		xtype: 'window-img-create',
		id: 'window-img-create',

		title: 'Создание изображения',
		width: 300,
		height: 340,
		modal: true,
		closeAction: 'hide',
		layout: 'fit',

		translateText: {
			inText: 'Вставить в текст',
			create: 'Создать',
			emptyImg: 'Пустое изображение'
		},

		/**
		 * @property {Object} Данные выделения.
		 */
		selectionRange: null,

		initComponent: function ()
		{
			var me = this;

			me.items = [
				{
					xtype: 'form',
					defaults: {
						margin: '10 0 0 10'
					},
					items: [
						{
							xtype: 'image-editor-picture'
						},
						{
							xtype: 'button-editor-select-img',
							scope: me
						},
						/*{
							xtype: 'checkbox',
							boxLabel: me.translateText.inText,
							name: 'inText',
							inputValue: '1'
						},*/
						{
							xtype: 'hidden',
							name: 'src',
							value: ''
						},
						{
							xtype: 'displayfield',
							name: 'name',
							value: me.translateText.emptyImg,
							submitValue: true
						}
					],
					buttonAlign: 'center',
					buttons: [
						{
							xtype: 'button',
							text: me.translateText.create,
							handler: function ()
							{
								var me = this,
									manager = FBEditor.getEditorManager(),
									win = me.up('window-img-create'),
									form = me.up('form'),
									values;

								// данные формы окна
								values = form.getValues();
								values.range = win.selectionRange;
								values.name = values.name === win.translateText.emptyImg ? '' : values.name;

								// создаем изображение
								manager.createElement('img', values);

								win.close();
							}
						}
					]
				}
			];

			me.callParent(arguments);
		},

		onHide: function ()
		{
			var me = this,
				data;

			// сбрасываем данные
			data = {
				url: 'undefined',
				name: me.translateText.emptyImg
			};
			me.updateData(data);

			me.callParent(arguments);
		},

		/**
		 * Обновляет данные окна.
		 * @param data Данные
		 * @param {String} data.url Путь изображения.
		 */
		updateData: function (data)
		{
			var me = this;

			me.down('image-editor-picture').updateView(data);
			me.down('[name=src]').setValue(data.url);
			me.down('[name=name]').setValue(data.name);
		}
	}
);