/**
 * Окно с жанрами и тегами.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.subject.window.Window',
	{
		extend: 'Ext.Panel',
		requires: [
			'FBEditor.view.form.desc.subject.tag.Tag',
			'FBEditor.view.form.desc.subject.window.WindowController',
			'FBEditor.view.form.desc.subject.SubjectTree'
		],

		id: 'form-desc-subject-win',
		xtype: 'form-desc-subject-win',
		controller: 'form.desc.subject.win',

		listeners: {
			alignTo: 'onAlignTo',
			resize: 'onResize'
		},

		floating: true,
		resizable: true,
		closeAction: 'hide',
		width: 450,
		height: 300,
		minHeight: 200,
		maxHeight: 500,
		overflowY: 'auto',
		shadow: false,

		/**
		 * @property {Boolean} Открыт ли список.
		 */
		isShow: false,

		/**
		 * @private
		 * @property {FBEditor.view.form.desc.subject.Subject} Поле жанра.
		 */
		subject: null,

		/**
		 * @private
		 * @property {FBEditor.view.form.desc.subject.SubjectTree} Дерево жанров.
		 */
		subjectTree: null,

		/**
		 * @private
		 * @property {FBEditor.view.form.desc.subject.tag.Tag} Контейнер с результатми поиска тегов.
		 */
		tag: null,
		
		initComponent: function ()
		{
			var me = this;
			
			me.items = [
				{
					xtype: 'form-desc-subjectTree'
				},
				{
					xtype: 'form-desc-subject-tag'
				}
			];
			
			me.callParent(arguments);
		},

		show: function ()
		{
			var me = this,
				subject = me.getSubject(),
				subjectTree = me.getSubjectTree(),
				tag = me.getTag(),
				subjectField,
				val;

			// инициализируем дерево жанров
			subjectTree.initData();

			if (subject)
			{
				me.callParent(arguments);

				// выравниваем окно относительно поля ввода
				me.fireEvent('alignTo');

				me.isShow = true;

				// фильтруем значение жанров
				subjectField = subject.getSubjectField();
				val = subjectField.getValue();
				subjectTree.fireEvent('filter', val);
				
				// показываем теги
				tag.showTags();
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

			// удаляем обработчик клика по всему документу, чтобы не висел зря и не копился
			Ext.getBody().un('click', me.onClickBody, me);

			me.callParent(arguments);

			// сворачиваем узлы
			//me.getRootNode().collapse(true);
		},

		/**
		 * Закрываем окно при нажатии на Esc.
		 */
		onEsc: function ()
		{
			this.close();
		},

		/**
		 * Устанавливает связь с полем ввода.
		 * @param {FBEditor.view.form.desc.subject.Subject} subject
		 */
		setSubject: function (subject)
		{
			this.subject = subject;
		},

		/**
		 * Возвращает поле ввода.
		 * @return {FBEditor.view.form.desc.subject.Subject}
		 */
		getSubject: function ()
		{
			return this.subject;
		},

		/**
		 * Возвращает дерево жанров.
		 * @return {FBEditor.view.form.desc.subject.SubjectTree}
		 */
		getSubjectTree: function ()
		{
			var me = this,
				subjectTree;

			subjectTree  = me.subjectTree || me.down('form-desc-subjectTree');
			me.subjectTree = subjectTree;

			return subjectTree;
		},

		/**
		 * Возвращает контейнер тегов.
		 * @return {FBEditor.view.form.desc.subject.tag.Tag}
		 */
		getTag: function ()
		{
			var me = this,
				tag;

			tag  = me.tag || me.down('form-desc-subject-tag');
			me.tag = tag;

			return tag;
		},

		/**
		 * @private
		 * Закрывает список, если клик произошел не по области списка и при этом не происходит изменение размеров
		 * дерева.
		 */
		onClickBody: function (e, input)
		{
			var me = this;

			// isShow ставится в false при изменении размеров окна, чтобы оно не закрылось
			// (см. в контроллере #onResize())
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