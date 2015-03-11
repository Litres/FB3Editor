/**
 * Контроллер группы радиобатонов.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.relations.subject.radio.RadioController',
	{
		extend: 'Ext.app.ViewController',
		alias: 'controller.form.desc.relations.subject.link.radio',

		/**
		 * Вызывается при изменении значения.
		 * @param {FBEditor.view.form.desc.relations.subject.radio.Radio} radio Радиобатоны.
		 * @param {Object} newVal Новое значение.
		 * @param {Object} oldVal Старое значение.
		 */
		onChange: function (radio, newVal, oldVal)
		{
			var me = this,
				listVal,
				val;

			val = Ext.Object.getValues(newVal)[0];
			if (val === 'other-list')
			{
				listVal = radio.up('form-desc-relations-subject-link').
					down('form-desc-relations-subject-link-list').getValue();
				if (!listVal)
				{
					// если селект пустой, то возвращаем предыдущее значение радиобатанов
					radio.setValue(oldVal);
				}
			}
		}
	}
);