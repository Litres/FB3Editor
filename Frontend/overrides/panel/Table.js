/**
 * Исправления для Ext.panel.Table.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.override.panel.Table',
	{
		override: 'Ext.panel.Table',

		handleFocusEnter: function(e) {
			var me = this,
				view = me.getView(),
				targetView,
				navigationModel = view.getNavigationModel(),
				lastFocused,
				focusPosition,
				br = view.bufferedRenderer,
				firstRecord;

			if (!me.containsFocus) {
				lastFocused = focusPosition = view.getLastFocused();

				// Default to the first cell if the NavigationModel has never focused anything
				if (!focusPosition) {
					targetView = view.isLockingView ? (view.lockedGrid.isVisible() ? view.lockedView : view.normalView) : view;
					firstRecord = view.dataSource.getAt(br ? br.getFirstVisibleRowIndex() : 0);

					// A non-row producing record like a collapsed placeholder.
					// We cannot focus these yet.
					if (firstRecord && !firstRecord.isNonData) {
						focusPosition = new Ext.grid.CellContext(targetView).setPosition({
							                                                                 row: firstRecord,
							                                                                 column: 0
						                                                                 });
					}
				}

				// Not a descendant which we allow to carry focus. Blur it.
				if (!focusPosition) {
					e.stopEvent();
					e.getTarget().blur();
					return;
				}
				navigationModel.setPosition(focusPosition, null, e, null, !!lastFocused);

				// We now contain focus is that was successful
				me.containsFocus = !!navigationModel.getPosition();
			}

			if (me.containsFocus) {
				this.getView().el.dom.setAttribute('tabindex', '-1');
			}
		}
	}
);