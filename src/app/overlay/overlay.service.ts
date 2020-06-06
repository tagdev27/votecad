import { Injectable, TemplateRef, ViewContainerRef } from '@angular/core';
import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal, TemplatePortal } from '@angular/cdk/portal';

@Injectable()
export class OverlayService {

  overlayRef:OverlayRef;

  constructor(private overlay: Overlay) { }
  open(config: AppOverlayConfig, component: any) {
    const positionStrategy = this.overlay.position()
      .global()
      .centerHorizontally()
      .centerVertically();
    config['positionStrategy'] = positionStrategy;
    // Returns an OverlayRef which is a PortalHost
    this.overlayRef = this.overlay.create(config);

    // Create ComponentPortal that can be attached to a PortalHost
    const componentPortal = new ComponentPortal(component);

    // Attach ComponentPortal to PortalHost
    this.overlayRef.attach(componentPortal);
  }

  close() {
    // Returns an OverlayRef which is a PortalHost

    // Create ComponentPortal that can be attached to a PortalHost

    // Attach ComponentPortal to PortalHost
    this.overlayRef.detach();
  }
}
export interface AppOverlayConfig extends OverlayConfig { }