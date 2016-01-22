/**
 * Окно с результатами поиска, привязанное к полю.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.searchField.Window',
	{
		extend: 'Ext.Panel',
		requires: [
			'FBEditor.view.form.desc.searchField.WindowController'
		],
		mixins: {
			behavior: 'FBEditor.view.container.desc.search.OwnerContainerBehavior'
		},
		xtype: 'form-desc-searchField-window',
		controller: 'form.desc.searchField.window',

		floating: true,
		width: 600,
		height: 300,
		maxHeight: 300,
		closeAction: 'hide',
		overflowY: 'auto',
		shadow: false,

		listeners: {
			loadData: 'onLoadData',
			select: 'onSelect',
			alignTo: 'onAlignTo',
			resize: 'onResize',
			click: {
				element: 'el',
				fn: 'onClick'
			}
		},

		/**
		 * @property {String} xtype контейнера с результатми поиска.
		 */
		xtypeContainerItems: '',

		/**
		 * @property {FBEditor.view.form.desc.searchField.SearchField} Поле поиска.
		 */
		searchField: null,

		/**
		 * @private
		 * @property {Ext.Container} Контейнер с результатми поиска.
		 */
		containerItems: null,

		initComponent: function ()
		{
			var me = this;

			if (!me.xtypeContainerItems)
			{
				throw Error('Необходимо определить свойство' +
				            ' FBEditor.view.form.desc.searchField.Window#xtypeContainerItems');
			}

			me.items = [
				{
					xtype: me.xtypeContainerItems,
					padding: 2,
					selectFn: function (data)
					{
						me.fireEvent('select', data);
						me.searchField.fireEvent('select', data);
					},
					onResize: function ()
					{
						var height = me.getHeight(),
							heightPersons = this.getHeight();

						// регулируем высоту окна по высоте содержимого
						if (height > heightPersons)
						{
							me.setHeight(heightPersons);
						}
						else if (height < 300)
						{
							me.setHeight(300);
						}
					}
				}
			];

			// fix
			me.fireHierarchyEvent = function (eventName) {};

			me.callParent(arguments);
		},

		show: function ()
		{
			var me = this;

			if (me.searchField)
			{
				me.callParent(arguments);
				me.fireEvent('alignTo');
				me.isShow = true;
			}
		},

		afterShow: function()
		{
			var me = this;

			// добавляем обработчик события клика по всему документу, чтобы иметь возможность закрывать окно
			Ext.getBody().on('click', me.onClickBody, me);

			me.callParent(arguments);
		},

		afterHide: function ()
		{
			var me = this;

			me.isShow = false;

			// удаляем обработчки клика по всему документу, чтобы не висел зря
			Ext.getBody().un('click', me.onClickBody, me);

			me.callParent(arguments);
		},

		/**
		 * Закрываем окно при нажатии на Esc.
		 */
		onEsc: function ()
		{
			this.close();
		},

		/**
		 * Закрывает список, если клик произошел не по области списка и при этом не происходит изменение размеров.
		 */
		onClickBody: function (e, input)
		{
			var me = this;

			// isShow ставится в false при изменении размеров окна, чтобы оно не закрылось (см. контроллер #onResize())
			if (!me.isShow)
			{
				me.isShow = true;
			}
			else
			{
				me.close();
			}
		},

		clean: function ()
		{
			this.close();
			this.mixins.behavior.clean.call(this);
		},

		abort: function ()
		{
			this.close();
			this.mixins.behavior.abort.call(this);
		},

		getContainerItems: function ()
		{
			return this.mixins.behavior.getContainerItems.call(this);
		}
	}
);