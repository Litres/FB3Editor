/**
 * Стандартное написание.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.relations.subject.title.Title',
	{
		extend: 'FBEditor.view.form.desc.title.Title',
		xtype: 'form-desc-relations-subject-title',
		layout: 'anchor',
		enableSub: false,
		defaults: {
			anchor: '100%',
			labelWidth: 160,
			labelAlign: 'right'
		},

		/**
		 * @property {Boolean} Заполнять ли стандартное описание автоматически из полей ФИО.
		 */
		autoFilled: true,

		/**
		 * @private
		 * @property {Ext.form.field.Text}
		 */
		titleMain: null,

		/**
		 * @private
		 * @property {FBEditor.view.form.desc.relations.subject.name.Name}
		 */
		lastName: null,

		/**
		 * @private
		 * @property {FBEditor.view.form.desc.relations.subject.name.Name}
		 */
		middleName: null,

		/**
		 * @private
		 * @property {FBEditor.view.form.desc.relations.subject.name.Name}
		 */
		firstName: null,

		afterRender: function ()
		{
			var me = this,
				titleMain;

			me.callParent(arguments);

			titleMain = me.getTitleMain();
			titleMain.on(
				{
					change: function ()
					{
						// отключаем автоматическое заполнение
						me.autoFilled = false;
					}
				}
			)
		},

		/**
		 * Автоматическое заполнение стандартного написания при помощи значений из ФИО.
		 */
		autoValue: function ()
		{
			var me = this,
				titleMain,
				value;

			if (me.autoFilled)
			{
				value = me.getNames();

				titleMain = me.getTitleMain();
				titleMain.setRawValue(value);
			}
		},

		/**
		 * Возвращает ФИО.
		 * @return {String}
		 */
		getNames: function ()
		{
			var me = this,
				val = {},
				value;

			val.last = me.getLastName().getValue();
			val.middle = me.getMiddleName().getValue();
			val.first = me.getFirstName().getValue();

			value = val.first ? val.first + ' ' : '';
			value += val.middle ? val.middle + ' ' : '';
			value += val.last ? val.last : '';
			value = value.trim();

			return value;
		},

		getLastName: function ()
		{
			var me = this,
				lastName;

			lastName = me.lastName ||
			           me.up('desc-fieldcontainer').up('desc-fieldcontainer').
						down('[name="relations-subject-last-name"]');

			return lastName;
		},

		getMiddleName: function ()
		{
			var me = this,
				middleName;

			middleName = me.middleName ||
			           me.up('desc-fieldcontainer').up('desc-fieldcontainer').
				           down('[name="relations-subject-middle-name"]');

			return middleName;
		},

		getFirstName: function ()
		{
			var me = this,
				firstName;

			firstName = me.firstName ||
			           me.up('desc-fieldcontainer').up('desc-fieldcontainer').
				           down('[name="relations-subject-first-name"]');

			return firstName;
		},

		getTitleMain: function ()
		{
			var me = this,
				titleMain;

			titleMain = me.titleMain || me.down('[name="' + me.name + '-main"]');

			return titleMain;
		}
	}
);