/**
 * Контроллер типа связи.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.relations.subject.LinkController',
	{
		extend: 'FBEditor.view.form.desc.AbstractFieldController',
		alias: 'controller.form.desc.relations.subject.link',

		onResetFields: function ()
		{
			var me = this,
				view = me.getView(),
				radio = FBEditor.view.form.desc.relations.subject.radio.Radio;

			//console.log('reset', radio.numberGroup, view);

			me.callParent(arguments);
		},

		/**
		 * Отмечает радиобатон списка при его изменении.
		 */
		onChangeList: function ()
		{
			var me= this,
				view = me.getView(),
				radio = view.getRadio();

			radio = radio.child('[reference=linkRadioOther]');
			//console.log('change list', radio);
			radio.setValue(true);
		}
	}
);