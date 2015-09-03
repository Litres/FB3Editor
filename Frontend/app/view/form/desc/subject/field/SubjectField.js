/**
 * Текстовое поле жанра.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.subject.field.SubjectField',
	{
		extend: 'Ext.form.field.Text',
		requires: [
			'FBEditor.view.form.desc.subject.field.SubjectFieldController'
		],
		xtype: 'form-desc-subject-field',
		controller: 'form.desc.subject.field',
		name: 'classification-subject',
		allowBlank: false,
		selectOnFocus: true,
		checkChangeBuffer: 200,
		//editable: false,
		cls: 'field-required',
		listeners: {
			click: {
				element: 'el',
				fn: 'onClick'
			},
			change: 'onChange'
		},

		/*afterRender: function ()
		{
			var me = this,
				subject = me.up('form-desc-subject'),
				subjectTree = subject.subjectTree;

			// обрабатываем esc в поле ввода
			me.keyNav = new Ext.util.KeyNav(
				{
					target: me.inputEl,
					forceKeyDown: true,
					esc: function ()
					{
						this.onEsc();
					},
					scope: subjectTree
				}
			);

			me.callParent(arguments);
		},*/

		/**
		 * Устанавливает курсор в конец поля.
		 */
		focusToEnd: function ()
		{
			var me = this,
				val = me.getValue();

			me.focus([val.length, val.length]);
		}
	}
);