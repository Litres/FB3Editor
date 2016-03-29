/**
 * Текстовое поле жанра.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.subject.field.SubjectField',
	{
		extend: 'FBEditor.view.form.desc.field.text.required.Required',
		requires: [
			'FBEditor.view.form.desc.subject.field.SubjectFieldController'
		],
		xtype: 'form-desc-subject-field',
		controller: 'form.desc.subject.field',
		name: 'classification-subject',
		selectOnFocus: true,
		checkChangeBuffer: 200,

		listeners: {
			click: {
				element: 'el',
				fn: 'onClick'
			},
			change: 'onChange',
			blur: 'onBlur'
		},

		/**
		 * @property {String} Сепаратор, который разделяет содержимое поля на несколько полей.
		 */
		separator: ';',

		afterRender: function ()
		{
			var me = this;

			// обрабатываем esc в поле ввода
			me.keyNav = new Ext.util.KeyNav(
				{
					target: me.inputEl,
					esc: function ()
					{
						var field = this,
							subjectTree = field.getSubjectTree(),
							tag = field.getTag();

						subjectTree.onEsc();
						tag.onEsc();
					},
					scope: me
				}
			);

			me.callParent(arguments);
		},

		getSubjectTree: function ()
		{
			return this.up('form-desc-subject').getSubjectTree() || null;
		},

		getTag: function ()
		{
			return this.up('form-desc-subject').getTag() || null;
		}
	}
);