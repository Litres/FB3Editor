/**
 * Список жанров.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.subject.SubjectTree',
	{
		extend: 'Ext.tree.Panel',
		requires: [
			'FBEditor.view.form.desc.subject.SubjectTreeController',
			'FBEditor.view.form.desc.subject.SubjectStore',
			'FBEditor.view.form.desc.subject.filter.Filter'
		],
		id: 'form-desc-subjectTree',
		xtype: 'form-desc-subjectTree',
		controller: 'form.desc.subjectTree',
		resizable: true,
		floating: true,
		closable: true,
		closeAction: 'hide',
		title: 'Выберите жанр',
		width: 450,
		height: 300,
		minHeight: 200,
		maxHeight: 500,
		autoScroll: true,
		rootVisible: false,
		animate: false,
		useArrows: true,
		displayField: 'name',
		tbar: [
			{
				xtype: 'form-desc-subject-filter'
			}
		],
		listeners: {
			click: {
				element: 'el',
				fn: 'onClick'
			},
			itemClick: 'onItemClick',
			alignTo: 'onAlignTo',
			resize: 'onResize'
		},

		/**
		 * @property {Boolean} Открыт ли список.
		 */
		isShow: false,

		/**
		 * @property {FBEditor.view.form.desc.subject.Subject} Поле жанра.
		 */
		subjectView: null,

		initComponent: function ()
		{
			var me = this,
				store;

			store = Ext.create('FBEditor.view.form.desc.subject.SubjectStore');
			me.store = store;
			me.callParent(arguments);
		},

		beforeShow: function()
		{
			var me = this;

			me.collapseAll();
			me.callParent(arguments);
			me.isShow = false;
		},

		afterShow: function()
		{
			var me = this,
				val,
				item;

			me.fireEvent('alignTo');
			Ext.getBody().on('click', me.onClick, me);
			me.callParent(arguments);
			if (me.subjectView)
			{
				val = me.subjectView.down('form-desc-subject-field').getValue();
				item = me.getItemByValue(val);
				if (item)
				{
					//console.log(item);
					me.expandPath('/root/' + item.parentId + '/' + item.id);
					me.selectPath('/root/' + item.parentId + '/' + item.id);
				}
			}
			me.getStore().clearFilter(true);
			me.down('form-desc-subject-filter').setValue('');
		},

		afterHide: function ()
		{
			var me = this;

			Ext.getBody().un('click', me.onClick, me);
			me.callParent(arguments);
		},

		/**
		 * Закрывает список, если клик произошел не по области списка.
		 */
		onClick: function ()
		{
			var me = this;

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
		 * Возвращает данные жанра по его значению.
		 * @param {String} val Значение жанра.
		 * @return {Object} Данные жанра.
		 */
		getItemByValue: function (val)
		{
			var me = this,
				store,
				itemStore = null;

			store = me.getStore();
			Ext.Array.findBy(
				store.getData().items,
				function (rec)
				{
					var v,
						children;

					children = rec.get('children');
					v = Ext.Array.findBy(
						children,
						function (item)
						{
							if (item.value === val)
							{
								itemStore = item;

								return true;
							}
						}
					);

					if (v)
					{
						return true;
					}
				}
			);

			return itemStore;
		},

		/**
		 * Возвращает название жанра по его значению.
		 * @param {String} val Значение жанра.
		 * @return {String} Название жанра.
		 */
		getNameByValue: function (val)
		{
			var me = this,
				name,
				item;

			item = me.getItemByValue(val);
			name = item ? item.name : val;

			return name;
		},

		/**
		 * Фильтрует дерево.
		 * @param {String} value Значение для фильтрации.
		 */
		filter: function (value)
		{
			var me = this,
				store = me.getStore(),
				val = value.toLowerCase();

			//console.log(val);
			store.clearFilter(true);
			store.filterBy(
				function (record)
				{
					var name = record.getData().name,
						children,
						res = false;

					if (record.isRoot())
					{
						return true;
					}

					// фильтруем узлы
					if (!record.isLeaf())
					{
						children = record.get('children');
						//console.log(children);
						Ext.Array.each(
							children,
						    function (item)
						    {
							    var n = item.name.toLowerCase();

							    if (n.indexOf(val) !== -1)
							    {
								    res = true;
							    }
						    }
						);

						return res;
					}

					// фильтруем листы
					if (name && (name.toLowerCase().indexOf(val) !== -1))
					{
						return true;
					}
				}
			);
		}
	}
);