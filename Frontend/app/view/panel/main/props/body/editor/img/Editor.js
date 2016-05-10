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
			var me = this,
				store;

			store = {
				sizeStore: Ext.create(
					'Ext.data.Store',
					{
						fields: ['value', 'text'],
						data: [
							{ value: 'em', text: 'em' },
							{ value: 'ex', text: 'ex' },
							{ value: '%', text: '%' },
							{ value: 'mm', text: 'mm' }
						]
					}
				)
			};

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
					xtype: 'fieldcontainer',
					labelAlign: 'left',
					fieldLabel: me.translateText.width,
					layout: {
						type: 'hbox',
						pack: 'start',
						align: 'stretch'
					},
					defaults: {
						checkChangeBuffer: 200,
						listeners: {
							change: function () {
								this.up('form').fireEvent('change');
							}
						}
					},
					style: {
						marginTop: '15px'
					},
					items: [
						{
							xtype: 'textfield',
							width: 53,
							name: me.prefixName + 'width',
							regex: /^\d+(\.\d+)?/,
							regexText: me.translateText.widthError,
							listeners: {
								blur: function () {
									me.stripWidthInput(this.id);
								},
								change: function () {
									this.up('form').fireEvent('change');
								}
							}
						},
						{
							xtype: 'combo',
							width: 60,
							name: me.prefixName + 'width-size',
							store: store.sizeStore,
							queryMode: 'local',
							valueField: 'value',
							displayField: 'text',
							value: 'em',
							editable: false
						}
					]
				},
				{
					xtype: 'fieldcontainer',
					labelAlign: 'left',
					fieldLabel: me.translateText.minWidth,
					layout: {
						type: 'hbox',
						pack: 'start',
						align: 'stretch'
					},
					defaults: {
						xtype: 'textfield',
						checkChangeBuffer: 200,
						listeners: {
							change: function () {
								this.up('form').fireEvent('change');
							}
						}
					},
					items: [
						{
							xtype: 'textfield',
							width: 53,
							name: me.prefixName + 'min-width',
							regex: /^\d+(\.\d+)?/,
							regexText: me.translateText.widthError,
							listeners: {
								blur: function () {
									me.stripWidthInput(this.id);
								},
								change: function () {
									this.up('form').fireEvent('change');
								}
							}
						},
						{
							xtype: 'combo',
							width: 60,
							name: me.prefixName + 'min-width-size',
							store: store.sizeStore,
							queryMode: 'local',
							valueField: 'value',
							displayField: 'text',
							value: 'em',
							editable: false
						}
					]
				},
				{
					xtype: 'fieldcontainer',
					labelAlign: 'left',
					fieldLabel: me.translateText.maxWidth,
					layout: {
						type: 'hbox',
						pack: 'start',
						align: 'stretch'
					},
					defaults: {
						xtype: 'textfield',
						checkChangeBuffer: 200,
						listeners: {
							change: function () {
								this.up('form').fireEvent('change');
							}
						}
					},
					items: [
						{
							xtype: 'textfield',
							width: 53,
							name: me.prefixName + 'max-width',
							regex: /^\d+(\.\d+)?/,
							regexText: me.translateText.widthError,
							listeners: {
								blur: function () {
									me.stripWidthInput(this.id);
								},
								change: function () {
									this.up('form').fireEvent('change');
								}
							}
						},
						{
							xtype: 'combo',
							width: 60,
							name: me.prefixName + 'max-width-size',
							store: store.sizeStore,
							queryMode: 'local',
							valueField: 'value',
							displayField: 'text',
							value: 'em',
							editable: false
						}
					]
				}
			];

			me.callParent(arguments);
		},

		stripWidthInput: function (id)
		{
			var me = this;
			var form = me.getForm();
			var field = form.findField(id);
			var fieldValue = field.getValue();
			if (fieldValue == '') {
				return;
			}
			var tmp = fieldValue.match(/^(\d+(\.\d+)?)(em|ex|%|mm)$/);
			if (tmp === null) {
				tmp = fieldValue.match(/^(\d+(\.\d+)?)/);
			} else {
				form.findField(field.getName() + '-size').setValue(tmp[3]);
			}
			if (tmp !== null) {
				field.setValue(tmp[1]);
			}
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