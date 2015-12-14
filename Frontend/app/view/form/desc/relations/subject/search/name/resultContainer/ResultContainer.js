/**
 * Окно с результатами поиска персон.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.relations.subject.search.name.resultContainer.ResultContainer',
	{
		extend: 'Ext.Panel',
		requires: [
			'FBEditor.view.form.desc.relations.subject.search.name.resultContainer.ResultContainerController'
		],
		xtype: 'form-desc-relations-subject-searchName-resultContainer',
		controller: 'form.desc.relations.subject.searchName.resultContainer',

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
			click: {
				element: 'el',
				fn: 'onClick'
			},
			alignTo: 'onAlignTo',
			resize: 'onResize'
		},

		/**
		 * @property {FBEditor.view.form.desc.relations.subject.search.name.Name} Поле ввода.
		 */
		inputField: null,

		/**
		 * @property {FBEditor.view.panel.persons.Persons} Панель персон.
		 */
		panelPersons: null,

		initComponent: function ()
		{
			var me = this;

			me.items = [
				{
					xtype: 'panel-persons',
					padding: 2,
					selectFn: function (data)
					{
						me.fireEvent('select', data);
						me.inputField.fireEvent('select', data);
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

			me.callParent(arguments);
		},

		show: function ()
		{
			var me = this;

			if (me.inputField)
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

		/**
		 * Возвращает панель персон.
		 * @return {FBEditor.view.panel.persons.Persons}
		 */
		getPanelPersons: function ()
		{
			var me = this,
				panel;

			panel = me.panelPersons || me.down('panel-persons');

			return panel;
		}
	}
);