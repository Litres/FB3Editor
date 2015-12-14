/**
 * Панель свойств редактора описания книги.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.props.desc.Desc',
	{
		extend: 'FBEditor.view.panel.main.props.Abstract',
		requires: [
			'FBEditor.view.panel.main.props.desc.DescController',
			'FBEditor.view.panel.main.props.desc.arts.Arts',
			'FBEditor.view.panel.main.props.desc.persons.Persons',
			'FBEditor.view.button.desc.Load',
			'FBEditor.view.button.desc.Save'
		],
		controller: 'panel.props.desc',
		id: 'panel-props-desc',
		xtype: 'panel-props-desc',

		listeners: {
			accessHub: 'onAccessHub'
		},

		translateText: {
			loadUrl: 'ID произведения для загрузки описания',
			saveUrl: 'URL для сохранения описания'
		},

		initComponent: function ()
		{
			var me = this,
				bridge = FBEditor.getBridgeWindow(),
				manager = bridge.FBEditor.desc.Manager,
				routeManager = bridge.FBEditor.route.Manager,
				params = routeManager.getParams(),
				hiddenLoadUrl,
				loadUrl,
				saveUrl;

			hiddenLoadUrl = bridge.Ext.getCmp('main') && bridge.FBEditor.accessHub ? false : true;
			loadUrl = params.art ? params.art : '';
			saveUrl = manager.saveUrl ? manager.saveUrl : '';

			me.items = [
				{
					xtype: 'numberfield',
					labelAlign: 'top',
					name: 'desc-load-url',
					fieldLabel: me.translateText.loadUrl,
					value: loadUrl,
					width: '100%',
					hideTrigger: true,
					allowBlank: false,
					checkChangeBuffer: 200,
					hidden: hiddenLoadUrl,
					listeners: {
						change: function (self, newVal)
						{
							var btn = Ext.getCmp('button-desc-load');

							manager.loadUrl = manager.url + '?art=' + newVal;

							if (newVal && self.isValid())
							{
								btn.enable();
							}
							else
							{
								btn.disable();
							}
						}
					}
				},
				{
					xtype: 'button-desc-load',
					disabled: loadUrl ? false : true,
					hidden: hiddenLoadUrl
				},
				/*,
				{
					xtype: 'textfield',
					vtype: 'url',
					labelAlign: 'top',
					name: 'desc-save-url',
					fieldLabel: me.translateText.saveUrl,
					value: saveUrl,
					width: '100%',
					marginTop: 10,
					allowBlank: false,
					checkChangeBuffer: 200,
					listeners: {
						change: function (self, newVal)
						{
							var btn = Ext.getCmp('button-desc-save');

							manager.saveUrl = newVal;

							if (newVal && self.isValid())
							{
								btn.enable();
							}
							else
							{
								btn.disable();
							}
						}
					}
				},
				{
					xtype: 'button-desc-save',
					disabled: saveUrl ? false : true
				}*/
				{
					xtype: 'props-desc-arts'
				},
				{
					xtype: 'props-desc-persons'
				}
			];

			me.callParent(arguments);
		},

		getContentId: function ()
		{
			return 'form-desc';
		},

		/**
		 * Устанавливает значение url для загрузки описания.
		 * @param {String} url Адрес для загрузки.
		 */
		setLoadUrl: function (url)
		{
			var me = this,
				field;

			field = me.down('[name="desc-load-url"]');
			field.setValue(url);
		},

		/**
		 * Возвращает поле url сохранения.
		 * @return {Ext.form.field.Field} Текстовое поле.
		 */
		getSaveField: function ()
		{
			var me = this,
				field;

			field = me.down('[name="desc-save-url"]');

			return field;
		}
	}
);