/**
 * Переключатель.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.relations.subject.custom.viewer.switcher.Switcher',
	{
		extend: 'Ext.Component',
		requires: [
			'FBEditor.view.form.desc.relations.subject.custom.viewer.switcher.SwitcherController'
		],

		xtype: 'form-desc-relations-subject-custom-viewer-switcher',
		controller: 'form.desc.relations.subject.custom.viewer.switcher',

		listeners: {
			
		},

		margin: '5 10 0 10',

		/**
		 * @private
		 * @property {Boolean} Развернуть ли сводку, true - развернуть.
		 */
		stateCmp: false,

		/**
		 * @private
		 * @property {FBEditor.view.form.desc.relations.subject.CustomContainer} Родительский контейнер данных.
		 */
		_container: null,

		/**
		 * @private
		 * @property {FBEditor.view.form.desc.relations.subject.item.SubjectItem} Родительский контейнер каждой персоны.
		 */
		_subjectItem: null,

		initComponent: function ()
		{
			var me = this;

			me.html = '+';

			me.callParent(arguments);
		},

		/**
		 * Переключает состояние компонента.
		 */
		toggle: function ()
		{
			var me = this,
				stateCmp = me.stateCmp,
				html;
			
			me.setStateCmp(!stateCmp);
			html = stateCmp ? '+' : '-';

			me.update(html);
		},

		/**
		 * Возвращает состояние переключателя.
		 * @return {Boolean}
		 */
		getStateCmp: function ()
		{
			return this.stateCmp;
		},

		/**
		 * Устанавливает состояние переключателя.
		 * @return {Boolean} Состояние.
		 */
		setStateCmp: function (state)
		{
			this.stateCmp = state;
		}
	}
);