/**
 * Менеджер скролла формы описания.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.ScrollManager',
	{
		singleton: true,

		/**
		 * Вызывается при возникновении события скролла.
		 * @param {Object} evt Объект события.
		 * @param {Node} el Элемент.
		 */
		event: function (evt, el)
		{
			//console.log('scroll', this, arguments);
		},

		startScroll: function ()
		{

		},

		endScroll: function ()
		{

		}
	}
);