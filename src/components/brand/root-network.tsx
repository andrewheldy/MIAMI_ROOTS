export function RootNetwork() {
  return (
    <div className="root-network" aria-hidden="true">
      <svg viewBox="0 0 800 720" role="presentation">
        <defs>
          <linearGradient id="root-fade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="currentColor" stopOpacity="0.18" />
            <stop offset="0.45" stopColor="currentColor" stopOpacity="0.7" />
            <stop offset="1" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
        </defs>

        <g className="root-network__canopy">
          <circle cx="400" cy="110" r="94" />
          <circle cx="294" cy="148" r="77" />
          <circle cx="506" cy="148" r="77" />
          <circle cx="226" cy="214" r="58" />
          <circle cx="574" cy="214" r="58" />
        </g>

        <g className="root-network__branches">
          <path d="M400 350C397 274 398 199 400 112" />
          <path d="M400 258C366 223 330 190 294 148" />
          <path d="M400 258C434 223 470 190 506 148" />
          <path d="M374 232C326 223 278 220 226 214" />
          <path d="M426 232C474 223 522 220 574 214" />
        </g>

        <g className="root-network__trunk">
          <path d="M371 204C384 267 374 319 348 392" />
          <path d="M429 204C416 267 426 319 452 392" />
          <path d="M348 392C374 373 392 361 400 334" />
          <path d="M452 392C426 373 408 361 400 334" />
        </g>

        <g className="root-network__roots" stroke="url(#root-fade)">
          <path d="M348 390C302 428 244 455 151 481S41 554 19 647" />
          <path d="M365 383C339 431 312 475 261 511s-80 81-91 151" />
          <path d="M383 370C376 438 354 492 327 542s-36 100-26 158" />
          <path d="M400 360C400 439 401 501 400 566s-9 101-24 147" />
          <path d="M417 370C424 438 446 492 473 542s36 100 26 158" />
          <path d="M435 383C461 431 488 475 539 511s80 81 91 151" />
          <path d="M452 390C498 428 556 455 649 481s110 73 132 166" />
          <path d="M311 421C268 417 224 405 184 371" />
          <path d="M489 421C532 417 576 405 616 371" />
          <path d="M268 508C219 499 173 505 126 533" />
          <path d="M532 508C581 499 627 505 674 533" />
          <path d="M328 543C286 564 253 598 229 644" />
          <path d="M472 543C514 564 547 598 571 644" />
        </g>

        <g className="root-network__nodes">
          <circle cx="400" cy="110" r="6" />
          <circle cx="294" cy="148" r="6" />
          <circle cx="506" cy="148" r="6" />
          <circle cx="226" cy="214" r="6" />
          <circle cx="574" cy="214" r="6" />
        </g>
      </svg>
    </div>
  );
}
