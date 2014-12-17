/**
 * Группа радиобатонов для выбора типа связи персоны.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.relations.subject.radio.Radio',
	{
		extend: 'Ext.form.RadioGroup',
		xtype: 'relations-subject-link-radio',
		allowBlank: false,

		statics:
		{
			/**
			 * @property {Number} Номер группы радиобатонов.
			 */
			numberGroup: 0
		},

		translateText: {
			author: 'Автор',
			translator: 'Переводчик'
		},

		initComponent: function ()
		{
			var me = this,
				numberGroup = me.self.numberGroup;

			me.name = 'relations-subject-link-radio-' + numberGroup;
			me.items = [
				{
					name: 'rel-subject-link-' + numberGroup,
					inputValue: 'author',
					boxLabel: me.translateText.author,
					checked: true,
					margin: '0 20 0 0'
				},
				{
					name: 'rel-subject-link-' + numberGroup,
					inputValue: 'translator',
					boxLabel: me.translateText.translator,
					margin: '0 20 0 0'
				},
				{
					name: 'rel-subject-link-' + numberGroup,
					inputValue: 'other-list',
					reference: 'linkRadioOther'
				}
			];
			numberGroup++;
			me.self.numberGroup = numberGroup;
			me.callParent(arguments);
		}
	}
);