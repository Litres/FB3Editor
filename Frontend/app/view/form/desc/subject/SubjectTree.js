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
			'FBEditor.view.form.desc.subject.SubjectStore'
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
		listeners: {
			click: {
				element: 'el',
				fn: 'onClick'
			}
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
			var me = this;

			me.alignTo(me.subjectView, 'tr', [-me.getWidth(), -me.getHeight()]);
			Ext.getBody().on('click', me.onClick, me);
			me.callParent(arguments);
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
		}
	}
);